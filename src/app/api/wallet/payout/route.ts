import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

// The Stripe account behind getStripe() is shared by every tenant on the
// platform (there's no Stripe Connect yet — see the go-live checklist), so
// stripe.balance.retrieve() returns the WHOLE platform's balance, not this
// tenant's share of it. Reporting that raw number here would let any tenant
// see (and in POST below, withdraw) money that isn't theirs. We cap what's
// shown/payable at this tenant's own internal ledger balance instead — the
// same number their Dashboard and Finance panels already show them.
async function ownLedgerBalanceCents(tenantId: string, supabase: NonNullable<Awaited<ReturnType<typeof requireTenant>>["supabase"]>) {
  const { data: accounts } = await supabase
    .from("wallet_accounts")
    .select("balance_cents")
    .eq("tenant_id", tenantId);
  return (accounts ?? []).reduce((sum, a) => sum + a.balance_cents, 0);
}

export async function GET() {
  if (!isStripeConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const stripe = getStripe();
  const balance = await stripe.balance.retrieve();
  const usdAvailable = balance.available.find((b) => b.currency === "usd")?.amount ?? 0;
  const usdPending = balance.pending.find((b) => b.currency === "usd")?.amount ?? 0;

  const ownBalance = await ownLedgerBalanceCents(tenantId!, supabase!);

  return NextResponse.json({ configured: true, availableCents: Math.max(0, Math.min(usdAvailable, ownBalance)), pendingCents: usdPending });
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

  // getStripe() is one shared platform account today, so nothing upstream of
  // this stops a tenant from requesting more than their own wallet actually
  // holds — bound the request server-side to what this tenant's own ledger
  // says is theirs, the same figure GET reports above.
  const ownBalance = await ownLedgerBalanceCents(tenantId!, supabase!);
  if (amountCents > ownBalance) {
    return NextResponse.json({ error: "That's more than your available balance." }, { status: 400 });
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

  await supabase!.from("receipts").insert({
    tenant_id: tenantId,
    kind: "payout",
    amount_cents: amountCents,
    currency: "usd",
    counterparty: "Your linked bank account",
    reference: payout.id,
  });

  return NextResponse.json({ payout: { id: payout.id, status: payout.status, arrivalDate: payout.arrival_date } });
}
