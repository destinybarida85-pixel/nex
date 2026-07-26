import { NextResponse } from "next/server";
import { requireTenant } from "@/lib/requireTenant";
import { isBackendConfigured } from "@/lib/backendStatus";
import { generateApiKey } from "@/lib/apiKeys";

export async function GET() {
  if (!isBackendConfigured) return NextResponse.json({ configured: false });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ configured: true, error }, { status });

  const { data: keys, error: keysError } = await supabase!
    .from("api_keys")
    .select("id, name, key_prefix, created_at, last_used_at, revoked_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (keysError) return NextResponse.json({ error: keysError.message }, { status: 500 });

  return NextResponse.json({ configured: true, keys });
}

export async function POST(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const { error, status, supabase, tenantId } = await requireTenant();
  if (error) return NextResponse.json({ error }, { status });

  const { name } = (await request.json().catch(() => ({}))) as { name?: string };
  const { plaintext, prefix, hash } = await generateApiKey();

  const { data: key, error: insertError } = await supabase!
    .from("api_keys")
    .insert({ tenant_id: tenantId, name: name?.trim() || "API key", key_hash: hash, key_prefix: prefix })
    .select("id, name, key_prefix, created_at")
    .single();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ key: { ...key, plaintext } });
}
