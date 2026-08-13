import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { isPendingMigration } from "@/lib/schema";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: beneficiaries, error: dbError } = await supabase!
    .from("beneficiaries")
    .select("id, name, bank, account_number, country, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (isPendingMigration(dbError)) return NextResponse.json({ configured: true, beneficiaries: [], migrationPending: true });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ configured: true, beneficiaries });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const body = (await request.json()) as { name?: string; bank?: string; accountNumber?: string; country?: string };
  if (!body.name?.trim() || !body.bank?.trim() || !body.accountNumber?.trim()) {
    return NextResponse.json({ error: "Give the beneficiary a name, bank, and account number." }, { status: 400 });
  }

  const { data: beneficiary, error: insertError } = await supabase!
    .from("beneficiaries")
    .insert({
      tenant_id: tenantId,
      name: body.name.trim(),
      bank: body.bank.trim(),
      account_number: body.accountNumber.trim(),
      country: body.country?.trim() || "US",
    })
    .select("id, name, bank, account_number, country, created_at")
    .single();

  if (isPendingMigration(insertError)) {
    return NextResponse.json({ error: "Beneficiaries aren't set up on the database yet — run the latest migration first." }, { status: 409 });
  }
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ beneficiary });
}
