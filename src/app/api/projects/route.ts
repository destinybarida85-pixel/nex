import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: projects, error: projError } = await supabase!
    .from("projects")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (projError) return NextResponse.json({ error: projError.message }, { status: 500 });

  return NextResponse.json({ configured: true, projects });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { name, client, status: projStatus, dueDate, notes } = (await request.json()) as {
    name?: string;
    client?: string;
    status?: string;
    dueDate?: string;
    notes?: string;
  };
  if (!name?.trim()) {
    return NextResponse.json({ error: "Give the project a name." }, { status: 400 });
  }
  const validStatus = ["Planning", "Active", "Blocked", "Done"];

  const { data: project, error: insertError } = await supabase!
    .from("projects")
    .insert({
      tenant_id: tenantId,
      name: name.trim(),
      client: client?.trim() || null,
      status: projStatus && validStatus.includes(projStatus) ? projStatus : "Planning",
      due_date: dueDate || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ project });
}
