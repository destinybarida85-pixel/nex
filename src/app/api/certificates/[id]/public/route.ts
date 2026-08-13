import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

// Intentionally unauthenticated — the same "anyone with the link can verify"
// pattern as /api/documents/[id]/public and /api/invoices/[id]/public. A
// certificate that only its issuer can view isn't verifiable by anyone who
// receives a copy, which defeats the point of issuing one.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: cert, error } = await supabase
    .from("certificates")
    .select("id, design, recipient_name, title, citation, issuer_name, issued_at, accent_color, style, tenant_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    // This endpoint is public, so it must never echo the database's own error
    // text back to a stranger — "Could not find the table 'public.certificates'
    // in the schema cache" tells an outsider about the schema and the fact that
    // a migration is missing. Log it, show the same neutral 404.
    console.error("[certificates/public] lookup failed:", isPendingMigration(error) ? "pending migration 0016" : error.message);
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }
  if (!cert) return NextResponse.json({ error: "Certificate not found." }, { status: 404 });

  const { data: tenant } = await supabase.from("tenants").select("name, logo_url").eq("id", cert.tenant_id).maybeSingle();

  return NextResponse.json({
    configured: true,
    certificate: {
      id: cert.id,
      design: cert.design,
      recipientName: cert.recipient_name,
      title: cert.title,
      citation: cert.citation,
      issuerName: cert.issuer_name || tenant?.name || "",
      issuerLogoUrl: tenant?.logo_url ?? null,
      issuedAt: cert.issued_at,
      accentColor: cert.accent_color,
      style: cert.style ?? {},
    },
  });
}
