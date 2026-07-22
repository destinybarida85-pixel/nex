import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: accounts, error: accountsError } = await supabase!
    .from("wallet_accounts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  if (accountsError) return NextResponse.json({ error: accountsError.message }, { status: 500 });

  const accountIds = (accounts ?? []).map((a) => a.id);
  const { data: transactions, error: txError } = await supabase!
    .from("wallet_transactions")
    .select("*")
    .in("account_id", accountIds.length ? accountIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(50);
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

  return NextResponse.json({ configured: true, accounts, transactions });
}
