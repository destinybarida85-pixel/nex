import { createAdminClient } from "@/lib/supabase/admin";

type SupabaseAdmin = ReturnType<typeof createAdminClient>;

// Best-effort, tenant-visible record of "something happened to my account" —
// never allowed to fail the webhook itself, since a logging hiccup here must
// not risk breaking real billing/credit/suspension logic.
export async function logWebhookEvent(
  supabase: SupabaseAdmin,
  tenantId: string | null,
  eventType: string,
  detail: string
) {
  try {
    await supabase.from("webhook_events").insert({ tenant_id: tenantId, event_type: eventType, detail });
  } catch {
    // Non-fatal — this table may not exist yet on a pre-migration deploy.
  }
}
