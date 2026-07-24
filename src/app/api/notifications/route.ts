import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: notifications, error: notifError } = await supabase!
    .from("notifications")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (notifError) return NextResponse.json({ error: notifError.message }, { status: 500 });

  return NextResponse.json({ configured: true, notifications });
}

export async function PATCH(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = (await request.json().catch(() => ({}))) as { id?: string };
  const query = supabase!.from("notifications").update({ read_at: new Date().toISOString() }).eq("tenant_id", tenantId);
  const { error: updateError } = id ? await query.eq("id", id) : await query.is("read_at", null);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
