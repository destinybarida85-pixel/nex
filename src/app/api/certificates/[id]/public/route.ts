import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";

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
    .select("id, design, recipient_name, title, citation, issuer_name, issued_at, accent_color, tenant_id")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      issuedAt: cert.issued_at,
      accentColor: cert.accent_color,
    },
  });
}
