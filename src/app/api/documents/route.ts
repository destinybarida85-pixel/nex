import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isMissingColumn } from "@/lib/twoPartySigning";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: documents, error: docsError } = await supabase!
    .from("documents")
    .select("id, title, status, created_at, payment_link_id, payment_links(id, title, amount_cents, currency)")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (docsError) return NextResponse.json({ error: docsError.message }, { status: 500 });

  return NextResponse.json({ configured: true, documents });
}

// Tenant-authored documents meant to be shown to clients (e.g. via the white-label
// mini site) — distinct from documents created through the /sign flow, which may
// belong to an external signer with no Origin account.
export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId, userId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { title, text, sections, paymentLinkId, layout, accentColor, logoUrl, signersRequired } =
    (await request.json()) as {
      title?: string;
      text?: string;
      sections?: { heading: string; text: string }[];
      paymentLinkId?: string | null;
      layout?: string;
      accentColor?: string;
      logoUrl?: string | null;
      signersRequired?: number;
    };
  const hasSections = Array.isArray(sections) && sections.length > 0;
  if (!title?.trim() || (!text?.trim() && !hasSections)) {
    return NextResponse.json({ error: "Give the document a title and some content." }, { status: 400 });
  }

  const content: Record<string, unknown> = hasSections ? { sections } : { text: text!.trim() };
  if (layout) content.layout = layout;
  if (accentColor) content.accentColor = accentColor;
  if (logoUrl) content.logoUrl = logoUrl;

  const row = {
    tenant_id: tenantId,
    created_by: userId,
    title: title.trim(),
    content,
    status: "sent",
    payment_link_id: paymentLinkId || null,
  };
  const returning = "id, title, status, created_at, payment_link_id, payment_links(id, title, amount_cents, currency)";

  // Clamped rather than trusted: the column has a 1–2 check constraint, and a
  // bad value from the client should fall back to the safe default instead of
  // failing the whole save.
  const signers = signersRequired === 2 ? 2 : 1;

  let { data: document, error: insertError } = await supabase!
    .from("documents")
    .insert({ ...row, signers_required: signers })
    .select(returning)
    .single();

  if (isMissingColumn(insertError)) {
    ({ data: document, error: insertError } = await supabase!.from("documents").insert(row).select(returning).single());
    if (!insertError) {
      return NextResponse.json({ document, signersRequiredSaved: false });
    }
  }
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ document });
}
