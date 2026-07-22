import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

function randomTxHash(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { walletId, toAddress, amount } = (await request.json()) as {
    walletId: string;
    toAddress: string;
    amount: number;
  };

  if (!walletId || !toAddress || !amount || amount <= 0) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const { data: wallet, error: walletError } = await supabase!
    .from("crypto_wallets")
    .select("id, balance")
    .eq("id", walletId)
    .eq("tenant_id", tenantId)
    .single();
  if (walletError || !wallet) {
    return NextResponse.json({ error: "Wallet not found." }, { status: 404 });
  }
  if (Number(wallet.balance) < amount) {
    return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
  }

  const txHash = randomTxHash();
  const { error: txError } = await supabase!.from("crypto_transactions").insert({
    wallet_id: walletId,
    direction: "debit",
    amount,
    counterparty_address: toAddress,
    tx_hash: txHash,
  });
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

  const { data: updated, error: updateError } = await supabase!
    .from("crypto_wallets")
    .update({ balance: Number(wallet.balance) - amount })
    .eq("id", walletId)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ configured: true, wallet: updated, txHash });
}
