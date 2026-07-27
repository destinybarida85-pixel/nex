import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { paymentLinkId } = (await request.json()) as { paymentLinkId?: string | null };

  const { data: document, error: updateError } = await supabase!
    .from("documents")
    .update({ payment_link_id: paymentLinkId || null })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("id, title, status, created_at, payment_link_id, payment_links(id, title, amount_cents, currency)")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ document });
}
