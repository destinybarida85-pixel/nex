import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isMissingColumn } from "@/lib/schema";

// Intentionally unauthenticated: this is the real, persisted white-label site a
// manager publishes for their clients to visit — the slug is the access key, same
// trust model as any hosted marketing site. Only safe, public-facing fields are
// ever returned; nothing internal (owner id, Stripe ids, other tenants) leaks.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ configured: false }, { status: 200 });

  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("id, name, brand_color, logo_url, header_image_url, site_template, site_published, powered_by_badge, site_document_ids, site_payment_link_id")
    .eq("site_slug", slug)
    .maybeSingle();

  if (error) {
    // Public endpoint: never echo the database's own error text to a stranger.
    console.error("[site/public] lookup failed:", error.message);
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }
  if (!tenant || !tenant.site_published) return NextResponse.json({ error: "Site not found." }, { status: 404 });

  const documentIds: string[] = tenant.site_document_ids || [];
  type DocRow = {
    id: string;
    title: string;
    content: unknown;
    status: string;
    payment_links: { title: string; amount_cents: number; currency: string; url: string; provider?: string } | null;
  };

  type DbErr = { code?: string; message?: string } | null;
  type SiteLinkRow = { title: string; amount_cents: number; currency: string; url: string; provider?: string };

  // provider (migration 0029) may not be applied on every deploy yet — fall
  // back to the pre-migration column list rather than 500ing the whole site.
  let documentsRes = (
    documentIds.length > 0
      ? await supabase.from("documents").select("id, title, content, status, payment_links(title, amount_cents, currency, url, provider)").in("id", documentIds)
      : { data: [] as DocRow[], error: null as DbErr }
  ) as unknown as { data: DocRow[] | null; error: DbErr };
  if (isMissingColumn(documentsRes.error)) {
    documentsRes = (await supabase
      .from("documents")
      .select("id, title, content, status, payment_links(title, amount_cents, currency, url)")
      .in("id", documentIds)) as unknown as { data: DocRow[] | null; error: DbErr };
  }

  let siteLinkRes = (
    tenant.site_payment_link_id
      ? await supabase.from("payment_links").select("title, amount_cents, currency, url, provider").eq("id", tenant.site_payment_link_id).maybeSingle()
      : { data: null as SiteLinkRow | null, error: null as DbErr }
  ) as unknown as { data: SiteLinkRow | null; error: DbErr };
  if (isMissingColumn(siteLinkRes.error)) {
    siteLinkRes = (await supabase
      .from("payment_links")
      .select("title, amount_cents, currency, url")
      .eq("id", tenant.site_payment_link_id!)
      .maybeSingle()) as unknown as { data: SiteLinkRow | null; error: DbErr };
  }

  const documents = documentsRes.data;
  const paymentLink = siteLinkRes.data;

  return NextResponse.json({
    configured: true,
    site: {
      name: tenant.name,
      brandColor: tenant.brand_color,
      logoUrl: tenant.logo_url,
      headerImageUrl: tenant.header_image_url,
      template: tenant.site_template,
      poweredByBadge: tenant.powered_by_badge,
      documents: ((documents as unknown as DocRow[]) || []).map((d) => ({
        id: d.id,
        title: d.title,
        text: (d.content as { text?: string })?.text ?? "",
        status: d.status,
        paymentLink: d.payment_links
          ? { title: d.payment_links.title, amountCents: d.payment_links.amount_cents, currency: d.payment_links.currency, url: d.payment_links.url, provider: d.payment_links.provider || "stripe" }
          : null,
      })),
      paymentLink: paymentLink ? { title: paymentLink.title, amountCents: paymentLink.amount_cents, currency: paymentLink.currency, url: paymentLink.url, provider: paymentLink.provider || "stripe" } : null,
    },
  });
}
