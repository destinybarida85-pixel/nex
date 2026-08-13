import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/notify";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Best-effort, tenant-visible record of "something happened to my account" —
// never allowed to fail the webhook itself, since a logging hiccup here must
// not risk breaking real billing/credit/suspension logic.
async function logWebhookEvent(
  supabase: SupabaseAdmin,
  tenantId: string | null,
  eventType: string,
  detail: string
) {
  try {
    await supabase.from("webhook_events").insert({ tenant_id: tenantId, event_type: eventType, detail });
  } catch {
    // Non-fatal — this table may not exist yet on a pre-migration deploy.
  }
}

// Stripe calls this directly (no user session), so it verifies the request via
// the webhook signature instead, and uses the service-role client to write
// across tenants. Configure this URL as a webhook endpoint in the Stripe
// dashboard, listening for checkout.session.completed.
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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Primue's own subscription billing (a tenant paying Primue for their plan),
    // distinguished from a one-time payment-link checkout by mode.
    if (session.mode === "subscription" && session.customer && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id;
      const plan =
        priceId === process.env.STRIPE_GROWTH_PRICE_ID
          ? "growth"
          : priceId === process.env.STRIPE_STARTER_PRICE_ID
            ? "starter"
            : "starter";

      // Signup bonus certificate credits, per the pricing page: Starter gets
      // 1 one-time, Growth gets 10 one-time (on top of whatever they already
      // have, same as the paid credit-pack purchase below — never a reset).
      // checkout.session.completed only fires once per actual checkout, not
      // on monthly renewals, which is exactly the "one-time" the pricing
      // page promises rather than something needing separate renewal logic.
      const SIGNUP_BONUS_CREDITS: Record<string, number> = { starter: 1, growth: 10 };
      const bonus = SIGNUP_BONUS_CREDITS[plan] ?? 0;

      const { data: tenant } = await supabase
        .from("tenants")
        .select("id, certificate_credits")
        .eq("stripe_customer_id", session.customer as string)
        .maybeSingle();

      await supabase
        .from("tenants")
        .update({
          subscription_id: subscription.id,
          plan,
          subscription_status: subscription.status,
          ...(tenant ? { certificate_credits: (tenant.certificate_credits ?? 0) + bonus } : {}),
        })
        .eq("stripe_customer_id", session.customer as string);

      await logWebhookEvent(supabase, tenant?.id ?? null, "checkout.session.completed", `Subscribed to ${plan}`);
    }

    if (session.mode === "payment" && session.metadata?.kind === "stamp_credits" && session.metadata.tenant_id) {
      const credits = Number(session.metadata.credits) || 10;
      const { data: tenant } = await supabase.from("tenants").select("stamp_credits").eq("id", session.metadata.tenant_id).single();
      if (tenant) {
        await supabase
          .from("tenants")
          .update({ stamp_credits: tenant.stamp_credits + credits })
          .eq("id", session.metadata.tenant_id);
        await logWebhookEvent(supabase, session.metadata.tenant_id, "checkout.session.completed", `+${credits} stamp credits`);
      }
    }

    if (session.mode === "payment" && session.metadata?.kind === "certificate_credits" && session.metadata.tenant_id) {
      const credits = Number(session.metadata.credits) || 5;
      const { data: tenant } = await supabase.from("tenants").select("certificate_credits").eq("id", session.metadata.tenant_id).single();
      if (tenant) {
        await supabase
          .from("tenants")
          .update({ certificate_credits: tenant.certificate_credits + credits })
          .eq("id", session.metadata.tenant_id);
        await logWebhookEvent(supabase, session.metadata.tenant_id, "checkout.session.completed", `+${credits} certificate credits`);
      }
    }

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

            await createNotification(
              supabase,
              link.tenant_id,
              "payment_received",
              `Payment received: ${(session.amount_total / 100).toLocaleString(undefined, { style: "currency", currency: (session.currency || "usd").toUpperCase() })}`,
              `${link.title} · ${session.customer_details?.email || "a customer"}`
            );

            await supabase.from("receipts").insert({
              tenant_id: link.tenant_id,
              kind: "payment",
              amount_cents: session.amount_total,
              currency: session.currency || "usd",
              counterparty: session.customer_details?.email || "a customer",
              reference: link.title,
            });

            await logWebhookEvent(
              supabase,
              link.tenant_id,
              "checkout.session.completed",
              `${link.title} — ${(session.amount_total / 100).toLocaleString(undefined, { style: "currency", currency: (session.currency || "usd").toUpperCase() })}`
            );
          }
        }
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    // Non-payment is the one condition, besides an admin's own judgment call,
    // that should lock a tenant out: Stripe already retried the card and gave
    // up ("unpaid") or the subscription is over ("canceled"). Deliberately
    // one-directional — recovering the subscription does NOT auto-unsuspend,
    // because a boolean `suspended` column can't tell "locked out for
    // non-payment" apart from "an admin suspended this for abuse"; silently
    // clearing the flag here could undo that second, unrelated decision.
    // Restoring access after a fixed payment is a deliberate admin action in
    // the Super Admin console, same as suspending it was.
    const lockedOutForNonPayment = subscription.status === "unpaid" || subscription.status === "canceled";

    const { data: subTenant } = await supabase
      .from("tenants")
      .select("id")
      .eq("stripe_customer_id", subscription.customer as string)
      .maybeSingle();

    await supabase
      .from("tenants")
      .update({
        subscription_status: subscription.status,
        ...(lockedOutForNonPayment ? { suspended: true } : {}),
      })
      .eq("stripe_customer_id", subscription.customer as string);

    await logWebhookEvent(
      supabase,
      subTenant?.id ?? null,
      event.type,
      lockedOutForNonPayment ? `Subscription ${subscription.status} — account suspended` : `Subscription status: ${subscription.status}`
    );
  }

  return NextResponse.json({ received: true });
}
