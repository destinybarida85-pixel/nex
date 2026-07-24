import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant } = await supabase!.from("tenants").select("stamp_credits").eq("id", tenantId).single();

  const { data: signatures, error: sigError } = await supabase!
    .from("signatures")
    .select("id, signer_name, signer_email, record_hash, signed_at, stamp_applied, documents!inner(id, title, tenant_id)")
    .eq("documents.tenant_id", tenantId)
    .order("signed_at", { ascending: false });
  if (sigError) return NextResponse.json({ error: sigError.message }, { status: 500 });

  return NextResponse.json({ configured: true, signatures, stampCredits: tenant?.stamp_credits ?? 0 });
}
