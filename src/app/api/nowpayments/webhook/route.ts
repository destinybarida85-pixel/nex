import { NextResponse } from "next/server";
import { isNowPaymentsConfigured, verifyIpnSignature } from "@/lib/nowpayments";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/notify";
import { logWebhookEvent } from "@/lib/webhookEvents";

// NOWPayments calls this directly (no user session), so like the Stripe
// webhook it verifies the request via a signature instead — the IPN secret
// from your NOWPayments dashboard, not a user auth token. Fires once per
// status change; only "finished" (crypto fully received and confirmed)
// actually credits the wallet, everything else is acknowledged and ignored.
export async function POST(request: Request) {
  if (!isNowPaymentsConfigured) return NextResponse.json({ received: false }, { status: 200 });

  const rawBody = await request.text();
  const signature = request.headers.get("x-nowpayments-sig");
  if (!verifyIpnSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const payload = JSON.parse(rawBody) as {
    payment_id: number | string;
    payment_status: string;
    order_id: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    pay_currency: string;
    actually_paid: number;
  };

  const supabase = createAdminClient();
  const paymentId = String(payload.payment_id);

  const { data: link } = await supabase
    .from("payment_links")
    .select("id, tenant_id, title")
    .eq("id", payload.order_id)
    .eq("provider", "crypto")
    .maybeSingle();

  if (!link) return NextResponse.json({ received: true });

  if (payload.payment_status !== "finished") {
    await logWebhookEvent(supabase, link.tenant_id, "nowpayments.ipn", `${link.title} — ${payload.payment_status}`);
    return NextResponse.json({ received: true });
  }

  const { data: existingEvent } = await supabase
    .from("payment_link_events")
    .select("id")
    .eq("nowpayments_payment_id", paymentId)
    .maybeSingle();
  if (existingEvent) return NextResponse.json({ received: true });

  const amountCents = Math.round(payload.price_amount * 100);

  await supabase.from("payment_link_events").insert({
    payment_link_id: link.id,
    nowpayments_payment_id: paymentId,
    amount_cents: amountCents,
    customer_email: null,
  });

  await supabase.rpc("increment_payment_link_uses", { link_id: link.id });

  const { data: account } = await supabase
    .from("wallet_accounts")
    .select("id, balance_cents")
    .eq("tenant_id", link.tenant_id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (account) {
    await supabase
      .from("wallet_accounts")
      .update({ balance_cents: account.balance_cents + amountCents })
      .eq("id", account.id);

    const cryptoDetail = `${payload.actually_paid} ${payload.pay_currency?.toUpperCase() ?? ""}`.trim();

    await supabase.from("wallet_transactions").insert({
      account_id: account.id,
      direction: "credit",
      counterparty: `Crypto payment (${cryptoDetail})`,
      amount_cents: amountCents,
      status: "completed",
      memo: link.title,
    });

    await createNotification(
      supabase,
      link.tenant_id,
      "payment_received",
      `Crypto payment received: ${(amountCents / 100).toLocaleString(undefined, { style: "currency", currency: payload.price_currency.toUpperCase() })}`,
      `${link.title} · paid in ${cryptoDetail}`
    );

    await supabase.from("receipts").insert({
      tenant_id: link.tenant_id,
      kind: "payment",
      amount_cents: amountCents,
      currency: payload.price_currency || "usd",
      counterparty: `Crypto payment (${cryptoDetail})`,
      reference: link.title,
    });

    await logWebhookEvent(
      supabase,
      link.tenant_id,
      "nowpayments.ipn",
      `${link.title} — ${(amountCents / 100).toLocaleString(undefined, { style: "currency", currency: payload.price_currency.toUpperCase() })} (${cryptoDetail})`
    );
  }

  return NextResponse.json({ received: true });
}
