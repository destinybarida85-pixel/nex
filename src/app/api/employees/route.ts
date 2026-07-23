import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: employees, error: empError } = await supabase!
    .from("employees")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (empError) return NextResponse.json({ error: empError.message }, { status: 500 });

  return NextResponse.json({ configured: true, employees });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { name, role, department, location, grossCents } = (await request.json()) as {
    name?: string;
    role?: string;
    department?: string;
    location?: string;
    grossCents?: number;
  };
  if (!name?.trim() || !role?.trim()) {
    return NextResponse.json({ error: "Give the employee a name and a role." }, { status: 400 });
  }

  const { data: employee, error: insertError } = await supabase!
    .from("employees")
    .insert({
      tenant_id: tenantId,
      name: name.trim(),
      role: role.trim(),
      department: department?.trim() || "General",
      location: location?.trim() || null,
      gross_cents: grossCents && grossCents > 0 ? Math.round(grossCents) : 0,
      deduction_cents: grossCents ? Math.round(grossCents * 0.25) : 0,
    })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ employee });
}
