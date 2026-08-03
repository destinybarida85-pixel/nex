import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import type { CertificateDesign } from "@/components/certificates/CertificatePaper";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant } = await supabase!.from("tenants").select("certificate_credits, name, brand_color").eq("id", tenantId).maybeSingle();

  const { data: certificates, error: listError } = await supabase!
    .from("certificates")
    .select("id, design, recipient_name, title, issued_at, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  return NextResponse.json({
    configured: true,
    certificates,
    credits: tenant?.certificate_credits ?? 0,
    tenantName: tenant?.name ?? "",
    brandColor: tenant?.brand_color ?? null,
  });
}

// Each certificate costs one credit, charged here rather than trusted from the
// client — the same reason stamp credits are decremented server-side in
// /api/sign, not wherever a button happens to be clicked.
export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as {
    design?: CertificateDesign;
    recipientName?: string;
    title?: string;
    citation?: string;
    issuerName?: string;
    accentColor?: string;
  };

  if (!body.recipientName?.trim() || !body.title?.trim() || !body.citation?.trim()) {
    return NextResponse.json({ error: "A certificate needs a recipient, a title, and a citation." }, { status: 400 });
  }

  const { data: tenant } = await supabase!.from("tenants").select("certificate_credits, name").eq("id", tenantId).single();
  const credits = tenant?.certificate_credits ?? 0;
  if (credits < 1) {
    return NextResponse.json({ error: "Out of certificate credits. Buy more to keep issuing." }, { status: 402 });
  }

  const { data: certificate, error: insertError } = await supabase!
    .from("certificates")
    .insert({
      tenant_id: tenantId,
      created_by: userId,
      design: body.design || "ribbon",
      recipient_name: body.recipientName.trim(),
      title: body.title.trim(),
      citation: body.citation.trim(),
      issuer_name: body.issuerName?.trim() || tenant?.name || null,
      accent_color: body.accentColor || null,
    })
    .select("id")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  await supabase!.from("tenants").update({ certificate_credits: credits - 1 }).eq("id", tenantId);

  return NextResponse.json({ certificate, creditsRemaining: credits - 1 });
}
