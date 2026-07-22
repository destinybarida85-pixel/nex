import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function GET() {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: wallets, error: walletsError } = await supabase!
    .from("crypto_wallets")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  if (walletsError) return NextResponse.json({ error: walletsError.message }, { status: 500 });

  const walletIds = (wallets ?? []).map((w) => w.id);
  const { data: transactions, error: txError } = await supabase!
    .from("crypto_transactions")
    .select("*")
    .in("wallet_id", walletIds.length ? walletIds : ["00000000-0000-0000-0000-000000000000"])
    .order("created_at", { ascending: false })
    .limit(50);
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

  return NextResponse.json({ configured: true, wallets, transactions });
}
