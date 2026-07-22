import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET() {
  if (!isStripeConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: account } = await supabase!
    .from("stripe_connect_accounts")
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  return NextResponse.json({ configured: true, account: account ?? null });
}

// Creates (if needed) a Stripe Express connected account for this tenant and
// returns a fresh onboarding link. Stripe onboarding links expire quickly and
// can only be used once, so we always mint a new one rather than caching it.
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  const { data: existing } = await supabase!
    .from("stripe_connect_accounts")
    .select("stripe_account_id")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  let stripeAccountId = existing?.stripe_account_id as string | undefined;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({ type: "express" });
    stripeAccountId = account.id;
    await supabase!.from("stripe_connect_accounts").insert({
      tenant_id: tenantId,
      stripe_account_id: stripeAccountId,
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${origin}/payments?stripe=refresh`,
    return_url: `${origin}/payments?stripe=return`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
