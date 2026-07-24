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

  return NextResponse.json({ configured: true, events });
}
