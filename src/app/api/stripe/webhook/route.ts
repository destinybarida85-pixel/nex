import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe calls this directly (no user session), so it verifies the request via
// the webhook signature instead, and uses the service-role client to write
// across tenants. Configure this URL as a Connect webhook endpoint in the
// Stripe dashboard so `account.updated` and connected-account checkout events
// both arrive here.
export async function POST(request: Request) {
  if (!isStripeConfigured) return NextResponse.json({ received: false }, { status: 200 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    await supabase
      .from("stripe_connect_accounts")
      .update({
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_account_id", account.id);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentLinkId = session.payment_link as string | null;
    if (paymentLinkId && session.amount_total) {
      const { data: link } = await supabase
        .from("payment_links")
        .select("id, tenant_id, title")
        .eq("stripe_payment_link_id", paymentLinkId)
        .maybeSingle();

      if (link) {
        const { data: existingEvent } = await supabase
          .from("payment_link_events")
          .select("id")
          .eq("stripe_checkout_session_id", session.id)
          .maybeSingle();

        if (!existingEvent) {
          await supabase.from("payment_link_events").insert({
            payment_link_id: link.id,
            stripe_checkout_session_id: session.id,
            amount_cents: session.amount_total,
            customer_email: session.customer_details?.email ?? null,
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
              .update({ balance_cents: account.balance_cents + session.amount_total })
              .eq("id", account.id);

            await supabase.from("wallet_transactions").insert({
              account_id: account.id,
              direction: "credit",
              counterparty: session.customer_details?.email || "Stripe payment link",
              amount_cents: session.amount_total,
              status: "completed",
              memo: link.title,
            });
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
