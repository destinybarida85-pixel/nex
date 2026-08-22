import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isMissingColumn } from "@/lib/schema";

// Intentionally unauthenticated: this is the "anyone with the link" read path for
// an invoice you email to a client. The payment link's random UUID is the access
// key, same pattern as /api/documents/[id]/public. Only what a payer needs to see
// is returned — never the Stripe ids, the tenant id, or who else has paid.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { id } = await params;
  const supabase = createAdminClient();

  // provider (migration 0029) may not be applied on every deploy yet — fall
  // back to the pre-migration column list rather than 500ing the page.
  let { data: link, error } = await supabase
    .from("payment_links")
    .select("id, title, amount_cents, currency, kind, interval, url, status, created_at, tenant_id, provider")
    .eq("id", id)
    .maybeSingle();
  if (isMissingColumn(error)) {
    ({ data: link, error } = await supabase
      .from("payment_links")
      .select("id, title, amount_cents, currency, kind, interval, url, status, created_at, tenant_id")
      .eq("id", id)
      .maybeSingle());
  }

  // A mistyped or truncated link fails at the database level with an "invalid
  // input syntax for uuid" error rather than a clean "no rows" — without this
  // it surfaces as a raw 500 instead of the same honest 404 a missing id gets.
  if (error) {
    if (error.code === "22P02") return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    // Public endpoint: never echo the database's own error text to a stranger.
    console.error("[invoices/public] lookup failed:", error.message);
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }
  if (!link) return NextResponse.json({ error: "Invoice not found." }, { status: 404 });

  const { data: tenant } = await supabase
    .from("tenants")
    .select("name, brand_color, logo_url, powered_by_badge")
    .eq("id", link.tenant_id)
    .maybeSingle();

  // Whether this invoice has actually been paid comes from the Stripe webhook,
  // not from anything the page can guess — a paid invoice must stop showing a
  // "Pay now" button.
  const { data: payment } = await supabase
    .from("payment_link_events")
    .select("amount_cents, created_at")
    .eq("payment_link_id", link.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    configured: true,
    invoice: {
      id: link.id,
      title: link.title,
      amountCents: link.amount_cents,
      currency: link.currency,
      kind: link.kind,
      interval: link.interval,
      payUrl: link.status === "active" ? link.url : null,
      provider: ("provider" in link ? link.provider : null) || "stripe",
      issuedAt: link.created_at,
      paidAt: payment?.created_at ?? null,
      from: {
        name: tenant?.name ?? "",
        accent: tenant?.brand_color ?? "#9184d9",
        logoUrl: tenant?.logo_url ?? null,
        poweredBy: !!tenant?.powered_by_badge,
      },
    },
  });
}
