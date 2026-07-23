import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

const PRICE_IDS: Record<string, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  growth: process.env.STRIPE_GROWTH_PRICE_ID,
};

// Real Stripe Checkout in subscription mode, with a 7-day trial — this is Origin
// charging the tenant for their plan, separate from the payment-links feature
// where the tenant charges their own clients.
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Billing isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as { plan?: string };
  const plan: string = body.plan ?? "";
  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json({ error: "Pick a valid plan (starter or growth)." }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  const { data: tenant } = await supabase!
    .from("tenants")
    .select("stripe_customer_id")
    .eq("id", tenantId)
    .single();

  let customerId = tenant?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const { data: authUser } = await supabase!.auth.getUser();
    const customer = await stripe.customers.create({
      email: authUser.user?.email ?? undefined,
      metadata: { tenant_id: tenantId, user_id: userId },
    });
    customerId = customer.id;
    await supabase!.from("tenants").update({ stripe_customer_id: customerId }).eq("id", tenantId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { trial_period_days: 7, metadata: { tenant_id: tenantId, plan } },
    success_url: `${origin}/dashboard?billing=success`,
    cancel_url: `${origin}/dashboard?billing=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
