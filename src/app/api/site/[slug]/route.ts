import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackendConfigured } from "@/lib/backendStatus";

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!tenant || !tenant.site_published) return NextResponse.json({ error: "Site not found." }, { status: 404 });

  const documentIds: string[] = tenant.site_document_ids || [];
  const [{ data: documents }, { data: paymentLink }] = await Promise.all([
    documentIds.length > 0
      ? supabase.from("documents").select("id, title, content, status").in("id", documentIds)
      : Promise.resolve({ data: [] as { id: string; title: string; content: unknown; status: string }[] }),
    tenant.site_payment_link_id
      ? supabase.from("payment_links").select("title, amount_cents, currency, url").eq("id", tenant.site_payment_link_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    configured: true,
    site: {
      name: tenant.name,
      brandColor: tenant.brand_color,
      logoUrl: tenant.logo_url,
      headerImageUrl: tenant.header_image_url,
      template: tenant.site_template,
      poweredByBadge: tenant.powered_by_badge,
      documents: (documents || []).map((d) => ({ id: d.id, title: d.title, text: (d.content as { text?: string })?.text ?? "", status: d.status })),
      paymentLink: paymentLink ? { title: paymentLink.title, amountCents: paymentLink.amount_cents, currency: paymentLink.currency, url: paymentLink.url } : null,
    },
  });
}
