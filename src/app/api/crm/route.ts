import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: deals, error: dealsError } = await supabase!
    .from("deals")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (dealsError) return NextResponse.json({ error: dealsError.message }, { status: 500 });

  return NextResponse.json({ configured: true, deals });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { company, title, valueCents, contact } = (await request.json()) as {
    company?: string;
    title?: string;
    valueCents?: number;
    contact?: string;
  };
  if (!company?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "Give the deal a company and a title." }, { status: 400 });
  }

  const { data: deal, error: insertError } = await supabase!
    .from("deals")
    .insert({
      tenant_id: tenantId,
      company: company.trim(),
      title: title.trim(),
      value_cents: valueCents && valueCents > 0 ? Math.round(valueCents) : 0,
      contact: contact?.trim() || null,
    })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ deal });
}
