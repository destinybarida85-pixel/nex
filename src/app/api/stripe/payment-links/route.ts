import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export async function GET() {
  if (!isStripeConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: links, error: linksError } = await supabase!
    .from("payment_links")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (linksError) return NextResponse.json({ error: linksError.message }, { status: 500 });

  return NextResponse.json({ configured: true, links });
}

// Creates a real, live Stripe Payment Link on the tenant's own connected account.
// The returned url is a genuine stripe.com checkout page — money paid through it
// settles to the tenant's own Stripe account, not Origin's.
export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return NextResponse.json({ error: "Stripe isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as {
    title: string;
    amountCents: number;
    kind: "one_time" | "recurring";
    interval?: "day" | "week" | "month" | "year";
  };

  if (!body.title?.trim() || !body.amountCents || body.amountCents < 1) {
    return NextResponse.json({ error: "Give the link a title and an amount." }, { status: 400 });
  }
  if (body.kind === "recurring" && !body.interval) {
    return NextResponse.json({ error: "Pick a billing interval for a recurring link." }, { status: 400 });
  }

  const { data: connectAccount } = await supabase!
    .from("stripe_connect_accounts")
    .select("stripe_account_id, charges_enabled")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (!connectAccount?.stripe_account_id) {
    return NextResponse.json({ error: "Connect your Stripe account before creating payment links." }, { status: 400 });
  }
  if (!connectAccount.charges_enabled) {
    return NextResponse.json(
      { error: "Your Stripe account is still finishing onboarding. Charges aren't enabled yet." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  const stripeAccountId = connectAccount.stripe_account_id as string;

  const price = await stripe.prices.create(
    {
      currency: "usd",
      unit_amount: body.amountCents,
      product_data: { name: body.title.trim() },
      ...(body.kind === "recurring" ? { recurring: { interval: body.interval! } } : {}),
    },
    { stripeAccount: stripeAccountId }
  );

  const paymentLink = await stripe.paymentLinks.create(
    { line_items: [{ price: price.id, quantity: 1 }] },
    { stripeAccount: stripeAccountId }
  );

  const { data: saved, error: saveError } = await supabase!
    .from("payment_links")
    .insert({
      tenant_id: tenantId,
      title: body.title.trim(),
      amount_cents: body.amountCents,
      currency: "usd",
      kind: body.kind,
      interval: body.kind === "recurring" ? body.interval : null,
      stripe_payment_link_id: paymentLink.id,
      stripe_price_id: price.id,
      url: paymentLink.url,
    })
    .select()
    .single();
  if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 });

  return NextResponse.json({ link: saved });
}
