import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";

function randomDigits(length: number): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((n) => String(n % 10)).join("");
}

export async function POST(request: Request) {
  if (!isBackendConfigured) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { label } = (await request.json()) as { label?: string };

  const { data: account, error: insertError } = await supabase!
    .from("wallet_accounts")
    .insert({
      tenant_id: tenantId,
      label: label?.trim() || "Sub-account",
      account_number: randomDigits(12),
      routing_number: randomDigits(9),
    })
    .select()
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ configured: true, account });
}
