import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

const SELECT_FIELDS =
  "name, domain, brand_color, powered_by_badge, stamp_credits, logo_url, header_image_url, site_slug, site_published, site_template, site_document_ids, site_payment_link_id";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: tenant, error: tenantError } = await supabase!
    .from("tenants")
    .select(SELECT_FIELDS)
    .eq("id", tenantId)
    .single();
  if (tenantError) return NextResponse.json({ error: tenantError.message }, { status: 500 });

  return NextResponse.json({ configured: true, tenant });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function PATCH(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as {
    name?: string;
    domain?: string;
    brandColor?: string;
    poweredByBadge?: boolean;
    logoUrl?: string;
    headerImageUrl?: string;
    siteSlug?: string;
    sitePublished?: boolean;
    siteTemplate?: string;
    siteDocumentIds?: string[];
    sitePaymentLinkId?: string | null;
  };

  const update: Record<string, unknown> = {};
  if (body.name?.trim()) update.name = body.name.trim();
  if (body.domain?.trim()) update.domain = body.domain.trim();
  if (body.brandColor?.trim()) update.brand_color = body.brandColor.trim();
  if (typeof body.poweredByBadge === "boolean") update.powered_by_badge = body.poweredByBadge;
  if (typeof body.logoUrl === "string") update.logo_url = body.logoUrl || null;
  if (typeof body.headerImageUrl === "string") update.header_image_url = body.headerImageUrl || null;
  if (body.siteSlug?.trim()) update.site_slug = slugify(body.siteSlug);
  if (typeof body.sitePublished === "boolean") update.site_published = body.sitePublished;
  if (body.siteTemplate && ["clarity", "ledger", "atrium"].includes(body.siteTemplate)) update.site_template = body.siteTemplate;
  if (Array.isArray(body.siteDocumentIds)) update.site_document_ids = body.siteDocumentIds;
  if (body.sitePaymentLinkId !== undefined) update.site_payment_link_id = body.sitePaymentLinkId || null;

  const { data: tenant, error: updateError } = await supabase!
    .from("tenants")
    .update(update)
    .eq("id", tenantId)
    .select(SELECT_FIELDS)
    .single();
  if (updateError) {
    const message = updateError.message.includes("duplicate key") ? "That website address is already taken." : updateError.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ tenant });
}
