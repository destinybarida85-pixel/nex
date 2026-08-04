import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashApiKey } from "@/lib/apiKeys";
import { isBackendConfigured } from "@/lib/backendStatus";

// A real, external-facing endpoint: authenticate with "Authorization: Bearer <key>"
// generated from Settings → API keys. This is the "link your own app/script to your
// Primue account" surface — the same auth pattern any real public API uses.
export async function GET(request: Request) {
  if (!isBackendConfigured) return NextResponse.json({ error: "Backend isn't connected yet." }, { status: 200 });

  const auth = request.headers.get("authorization") || "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!key) return NextResponse.json({ error: "Missing Authorization: Bearer <key> header." }, { status: 401 });

  const hash = await hashApiKey(key);
  const supabase = createAdminClient();

  const { data: apiKey } = await supabase
    .from("api_keys")
    .select("id, tenant_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (!apiKey || apiKey.revoked_at) {
    return NextResponse.json({ error: "Invalid or revoked API key." }, { status: 401 });
  }

  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", apiKey.id);

  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, title, status, created_at, updated_at")
    .eq("tenant_id", apiKey.tenant_id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ documents });
}
