import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

// Real available balance comes from Stripe itself, not our internal ledger —
// Stripe's own settled/pending split is the actual source of truth for what
// can be paid out right now.
export async function GET() {
  if (!isStripeConfigured) return NextResponse.json({ configured: false });

  const { error, status } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const stripe = getStripe();
  const balance = await stripe.balance.retrieve();
  const usdAvailable = balance.available.find((b) => b.currency === "usd")?.amount ?? 0;
  const usdPending = balance.pending.find((b) => b.currency === "usd")?.amount ?? 0;

  return NextResponse.json({ configured: true, availableCents: usdAvailable, pendingCents: usdPending });
}

// A real Stripe Payout — moves money from your Stripe balance to your own
// connected bank account. This is not "send money to a vendor": Stripe payouts
// only ever go to the bank account you've linked to your own Stripe account.
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Payouts aren't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { amountCents } = (await request.json()) as { amountCents?: number };
  if (!amountCents || amountCents < 1) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }

  const stripe = getStripe();

  let payout;
  try {
    payout = await stripe.payouts.create({ amount: Math.round(amountCents), currency: "usd" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const { data: account } = await supabase!
    .from("wallet_accounts")
    .select("id, balance_cents")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (account) {
    await supabase!
      .from("wallet_accounts")
      .update({ balance_cents: Math.max(0, account.balance_cents - amountCents) })
      .eq("id", account.id);

    await supabase!.from("wallet_transactions").insert({
      account_id: account.id,
      direction: "debit",
      counterparty: "Stripe payout to bank",
      amount_cents: amountCents,
      status: payout.status === "paid" ? "completed" : "pending",
      memo: `Payout ${payout.id}`,
    });
  }

  return NextResponse.json({ payout: { id: payout.id, status: payout.status, arrivalDate: payout.arrival_date } });
}
