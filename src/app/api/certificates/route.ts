import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";
import { isValidDesign } from "@/components/certificates/designs";

const SETUP_MESSAGE =
  "Certificates need one database migration before they work. Run supabase/migrations/0016_certificates.sql in your Supabase SQL editor, then reload this page.";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant, error: tenantError } = await supabase!
    .from("tenants")
    .select("certificate_credits, name, brand_color, logo_url")
    .eq("id", tenantId)
    .maybeSingle();
  if (isPendingMigration(tenantError)) {
    return NextResponse.json({ configured: true, setupRequired: true, setupMessage: SETUP_MESSAGE });
  }

  const { data: certificates, error: listError } = await supabase!
    .from("certificates")
    .select("id, design, recipient_name, title, issued_at, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  // Without this the page fell back to its signed-out demo state — showing a
  // fake "2 credits" and a disabled button with no explanation — which looks
  // identical to the feature simply being broken.
  if (isPendingMigration(listError)) {
    return NextResponse.json({ configured: true, setupRequired: true, setupMessage: SETUP_MESSAGE });
  }
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  return NextResponse.json({
    configured: true,
    certificates,
    credits: tenant?.certificate_credits ?? 0,
    tenantName: tenant?.name ?? "",
    brandColor: tenant?.brand_color ?? null,
    logoUrl: tenant?.logo_url ?? null,
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
    design?: string;
    recipientName?: string;
    title?: string;
    citation?: string;
    issuerName?: string;
    accentColor?: string;
    style?: Record<string, unknown>;
  };

  if (!body.recipientName?.trim() || !body.title?.trim() || !body.citation?.trim()) {
    return NextResponse.json({ error: "A certificate needs a recipient, a title, and a citation." }, { status: 400 });
  }

  const { data: tenant, error: tenantError } = await supabase!
    .from("tenants")
    .select("certificate_credits, name")
    .eq("id", tenantId)
    .single();
  if (isPendingMigration(tenantError)) {
    return NextResponse.json({ error: SETUP_MESSAGE }, { status: 503 });
  }
  const credits = tenant?.certificate_credits ?? 0;
  if (credits < 1) {
    return NextResponse.json({ error: "Out of certificate credits. Buy more to keep issuing." }, { status: 402 });
  }

  const { data: certificate, error: insertError } = await supabase!
    .from("certificates")
    .insert({
      tenant_id: tenantId,
      created_by: userId,
      // The DB CHECK on design was dropped in 0017 so new templates don't each
      // need a migration; the catalogue in the app is the source of truth, so
      // validate here instead of trusting whatever the client sent.
      design: isValidDesign(body.design) ? body.design : "ribbon",
      recipient_name: body.recipientName.trim(),
      title: body.title.trim(),
      citation: body.citation.trim(),
      issuer_name: body.issuerName?.trim() || tenant?.name || null,
      accent_color: body.accentColor || null,
      style: body.style ?? {},
    })
    .select("id")
    .single();
  if (isPendingMigration(insertError)) {
    return NextResponse.json({ error: SETUP_MESSAGE }, { status: 503 });
  }
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  await supabase!.from("tenants").update({ certificate_credits: credits - 1 }).eq("id", tenantId);

  return NextResponse.json({ certificate, creditsRemaining: credits - 1 });
}
