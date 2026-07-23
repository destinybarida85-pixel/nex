import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant, error: tenantError } = await supabase!
    .from("tenants")
    .select("plan, subscription_status")
    .eq("id", tenantId)
    .single();
  if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 500 });

  return NextResponse.json({ configured: true, plan: tenant.plan, status: tenant.subscription_status });
}
