import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

export async function POST(request: Request) {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { accountId, counterparty, amountCents } = (await request.json()) as {
    accountId: string;
    counterparty: string;
    amountCents: number;
  };

  if (!accountId || !counterparty || !amountCents || amountCents <= 0) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }

  const { data: account, error: accountError } = await supabase!
    .from("wallet_accounts")
    .select("id, balance_cents")
    .eq("id", accountId)
    .eq("tenant_id", tenantId)
    .single();
  if (accountError || !account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  if (account.balance_cents < amountCents) {
    return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
  }

  const { error: txError } = await supabase!.from("wallet_transactions").insert({
    account_id: accountId,
    direction: "debit",
    counterparty,
    amount_cents: amountCents,
    status: "completed",
  });
  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

  const { data: updated, error: updateError } = await supabase!
    .from("wallet_accounts")
    .update({ balance_cents: account.balance_cents - amountCents })
    .eq("id", accountId)
    .select()
    .single();
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ configured: true, account: updated });
}
