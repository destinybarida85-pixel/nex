import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Billing isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { data: tenant } = await supabase!
    .from("tenants")
    .select("stripe_customer_id")
    .eq("id", tenantId)
    .single();

  if (!tenant?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account yet — subscribe to a plan first." }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: tenant.stripe_customer_id,
    return_url: `${origin}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
