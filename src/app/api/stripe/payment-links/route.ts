import { NextResponse } from "next/server";
import Stripe from "stripe";
import { requireTenant } from "@/lib/requireTenant";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createInvoice, isNowPaymentsConfigured } from "@/lib/nowpayments";

export async function GET() {
  if (!isStripeConfigured && !isNowPaymentsConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: links, error: linksError } = await supabase!
    .from("payment_links")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (linksError) return NextResponse.json({ error: linksError.message }, { status: 500 });

  return NextResponse.json({ configured: true, links, cryptoConfigured: isNowPaymentsConfigured, stripeConfigured: isStripeConfigured });
}

// Creates a real, live payment link — Stripe checkout by default, or a real
// NOWPayments crypto invoice when provider: "crypto" is passed and NOWPayments
// is connected. Either way the returned url is a genuine hosted checkout page
// and money settles directly to your own Stripe balance or NOWPayments account.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    title: string;
    amountCents: number;
    kind: "one_time" | "recurring";
    interval?: "day" | "week" | "month" | "year";
    provider?: "stripe" | "crypto";
  };
  const provider = body.provider === "crypto" ? "crypto" : "stripe";

  if (provider === "stripe" && !isStripeConfigured) {
    return NextResponse.json({ error: "Stripe isn't connected yet." }, { status: 200 });
  }
  if (provider === "crypto" && !isNowPaymentsConfigured) {
    return NextResponse.json({ error: "NOWPayments isn't connected yet." }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  if (!body.title?.trim() || !body.amountCents || body.amountCents < 1) {
    return NextResponse.json({ error: "Give the link a title and an amount." }, { status: 400 });
  }
  if (body.kind === "recurring" && !body.interval) {
    return NextResponse.json({ error: "Pick a billing interval for a recurring link." }, { status: 400 });
  }
  if (provider === "crypto" && body.kind === "recurring") {
    return NextResponse.json({ error: "Crypto payment links are one-time only — recurring crypto billing isn't supported." }, { status: 400 });
  }

  if (provider === "crypto") {
    // Inserted with a placeholder url first because NOWPayments needs an
    // order_id up front, and the webhook later needs to look this row up by
    // that same order_id — using this row's own id keeps that a straight
    // lookup instead of a second correlation table.
    const { data: placeholder, error: placeholderError } = await supabase!
      .from("payment_links")
      .insert({
        tenant_id: tenantId,
        title: body.title.trim(),
        amount_cents: body.amountCents,
        currency: "usd",
        kind: "one_time",
        provider: "crypto",
        url: "",
      })
      .select()
      .single();
    if (placeholderError) return NextResponse.json({ error: placeholderError.message }, { status: 500 });

    let invoice: { id: string; invoice_url: string };
    try {
      invoice = await createInvoice({
        priceAmountCents: body.amountCents,
        priceCurrency: "usd",
        orderId: placeholder.id,
        orderDescription: body.title.trim(),
        ipnCallbackUrl: `${new URL(request.url).origin}/api/nowpayments/webhook`,
      });
    } catch (err) {
      await supabase!.from("payment_links").delete().eq("id", placeholder.id);
      return NextResponse.json({ error: err instanceof Error ? err.message : "NOWPayments rejected the request." }, { status: 502 });
    }

    const { data: saved, error: saveError } = await supabase!
      .from("payment_links")
      .update({ nowpayments_invoice_id: invoice.id, url: invoice.invoice_url })
      .eq("id", placeholder.id)
      .select()
      .single();
    if (saveError) return NextResponse.json({ error: saveError.message }, { status: 500 });

    return NextResponse.json({ link: saved });
  }

  const stripe = getStripe();

  // Neither call was wrapped in try/catch, so a real Stripe rejection (e.g.
  // no payment method activated for this currency in the Stripe dashboard —
  // confirmed against the live account: every attempt to create a link was
  // failing with exactly that) threw an unhandled exception. Next turns that
  // into a bare 500 with no JSON body, which the client's res.json() then
  // fails to parse, landing in its generic catch and showing "Couldn't reach
  // the server" — hiding the real, fixable reason completely.
  let price: Stripe.Price;
  let paymentLink: Stripe.PaymentLink;
  try {
    price = await stripe.prices.create({
      currency: "usd",
      unit_amount: body.amountCents,
      product_data: { name: body.title.trim() },
      ...(body.kind === "recurring" ? { recurring: { interval: body.interval! } } : {}),
    });

    paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    });
  } catch (err) {
    const message = err instanceof Stripe.errors.StripeError ? err.message : "Stripe rejected the request.";
    const hint =
      err instanceof Stripe.errors.StripeError && err.code === "payment_link_no_valid_payment_methods"
        ? " Go to your Stripe Dashboard → Settings → Payment methods and activate at least one method (e.g. Cards) for USD, then try again."
        : "";
    return NextResponse.json({ error: `${message}${hint}` }, { status: 502 });
  }

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
