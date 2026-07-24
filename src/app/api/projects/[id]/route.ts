import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

const validStatus = ["Planning", "Active", "Blocked", "Done"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { id } = await params;
  const { status: projStatus } = (await request.json()) as { status?: string };
  if (!projStatus || !validStatus.includes(projStatus)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const { data: project, error: updateError } = await supabase!
    .from("projects")
    .update({ status: projStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ project });
}
