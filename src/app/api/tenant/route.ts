import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant, error: tenantError } = await supabase!
    .from("tenants")
    .select("name, domain, brand_color, powered_by_badge")
    .eq("id", tenantId)
    .single();
  if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 500 });

  return NextResponse.json({ configured: true, tenant });
}

export async function PATCH(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { name, domain, brandColor, poweredByBadge } = (await request.json()) as {
    name?: string;
    domain?: string;
    brandColor?: string;
    poweredByBadge?: boolean;
  };

  const update: Record<string, unknown> = {};
  if (name?.trim()) update.name = name.trim();
  if (domain?.trim()) update.domain = domain.trim();
  if (brandColor?.trim()) update.brand_color = brandColor.trim();
  if (typeof poweredByBadge === "boolean") update.powered_by_badge = poweredByBadge;

  const { data: tenant, error: updateError } = await supabase!
    .from("tenants")
    .update(update)
    .eq("id", tenantId)
    .select("name, domain, brand_color, powered_by_badge")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ tenant });
}
