import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const [{ data: employees, error: empError }, { data: runs, error: runsError }] = await Promise.all([
    supabase!.from("employees").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }),
    supabase!.from("payroll_runs").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false }).limit(12),
  ]);
  if (empError) return NextResponse.json({ error: empError.message }, { status: 500 });
  if (runsError) return NextResponse.json({ error: runsError.message }, { status: 500 });

  return NextResponse.json({ configured: true, employees, runs });
}

// Recording a payroll run here means saving a real history entry — it does not
// move real money. Actually depositing pay through a payroll processor isn't
// wired up yet (see /security for what's real today).
export async function POST() {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { data: employees, error: empError } = await supabase!
    .from("employees")
    .select("gross_cents, deduction_cents")
    .eq("tenant_id", tenantId);
  if (empError) return NextResponse.json({ error: empError.message }, { status: 500 });

  const totalCents = (employees ?? []).reduce((sum, e) => sum + (e.gross_cents - e.deduction_cents), 0);
  const period = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const { data: run, error: insertError } = await supabase!
    .from("payroll_runs")
    .insert({ tenant_id: tenantId, period, employee_count: employees?.length ?? 0, total_cents: totalCents })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ run });
}
