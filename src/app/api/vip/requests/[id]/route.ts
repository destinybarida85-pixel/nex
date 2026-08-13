import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const body = (await request.json()) as { status?: "approved" | "dismissed" };
  if (body.status !== "approved" && body.status !== "dismissed") {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data, error: updateError } = await supabase!
    .from("vip_requests")
    .update({ status: body.status })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("id, status")
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ request: data });
}
