import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: events, error: eventsError } = await supabase!
    .from("payment_link_events")
    .select("id, amount_cents, customer_email, created_at, payment_links!inner(id, title, currency, tenant_id)")
    .eq("payment_links.tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (eventsError) return NextResponse.json({ error: eventsError.message }, { status: 500 });

  // Every payment link doubles as a sendable invoice: it already carries a
  // title, an amount and a real Stripe checkout page. Returning them here is
  // what lets this page offer a shareable /invoice/[id] link per row, instead
  // of only listing money that has already been collected.
  const { data: links, error: linksError } = await supabase!
    .from("payment_links")
    .select("id, title, amount_cents, currency, kind, interval, uses_count, status, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (linksError) return NextResponse.json({ error: linksError.message }, { status: 500 });

  const { data: tenant } = await supabase!.from("tenants").select("name").eq("id", tenantId).maybeSingle();

  return NextResponse.json({ configured: true, events, links, tenantName: tenant?.name ?? "" });
}
