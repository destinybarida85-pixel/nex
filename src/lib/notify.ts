import type { SupabaseClient } from "@supabase/supabase-js";

export async function createNotification(
  supabase: SupabaseClient,
  tenantId: string,
  kind: "document_signed" | "payment_received" | "invite_accepted",
  title: string,
  body?: string
) {
  await supabase.from("notifications").insert({ tenant_id: tenantId, kind, title, body: body || null });
}
