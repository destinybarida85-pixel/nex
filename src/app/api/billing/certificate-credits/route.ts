import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

// A real, one-time Stripe Checkout for a pack of certificate credits — priced
// well above stamp credits ($9/10 there vs. $15/5 here) because certificates
// are the premium tier the user asked for, not a per-signature convenience.
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Billing isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  const { data: tenant } = await supabase!.from("tenants").select("stripe_customer_id").eq("id", tenantId).single();

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
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "5 premium certificate credits" },
          unit_amount: 1500,
        },
        quantity: 1,
      },
    ],
    metadata: { tenant_id: tenantId, kind: "certificate_credits", credits: "5" },
    success_url: `${origin}/certificates?credits=success`,
    cancel_url: `${origin}/certificates?credits=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
