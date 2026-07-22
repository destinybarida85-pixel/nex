import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const [{ data: profile }, { data: tenant }] = await Promise.all([
    supabase!.from("profiles").select("full_name").eq("id", userId).single(),
    supabase!.from("tenants").select("name").eq("id", tenantId).single(),
  ]);

  return NextResponse.json({
    configured: true,
    fullName: profile?.full_name || "",
    tenantName: tenant?.name || "My Business",
  });
}
