import type { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

// Every caller already passes the service-role admin client (these all fire
// from webhooks or the unauthenticated /api/sign route, which have no user
// session to scope a normal client to) — auth.admin.getUserById needs that
// same service role, so no separate client is required here.
async function getTenantOwnerEmail(supabase: SupabaseClient, tenantId: string): Promise<string | null> {
  const { data: tenant } = await supabase.from("tenants").select("owner_id, name").eq("id", tenantId).maybeSingle();
  if (!tenant?.owner_id) return null;
  try {
    const { data, error } = await supabase.auth.admin.getUserById(tenant.owner_id);
    if (error || !data?.user?.email) return null;
    return data.user.email;
  } catch {
    return null;
  }
}

const KIND_LABEL: Record<string, string> = {
  document_signed: "Document signed",
  payment_received: "Payment received",
  invite_accepted: "Team member joined",
};

export async function createNotification(
  supabase: SupabaseClient,
  tenantId: string,
  kind: "document_signed" | "payment_received" | "invite_accepted",
  title: string,
  body?: string
) {
  await supabase.from("notifications").insert({ tenant_id: tenantId, kind, title, body: body || null });

  // Real email, same "flag it, don't fake it" gating as every other
  // integration — sendEmail() itself is a no-op with an honest error when
  // RESEND_API_KEY isn't set, so this stays silent until that's configured.
  // Best-effort and isolated in its own try/catch: an email failure (or a
  // tenant with no resolvable owner email) must never break the actual
  // business event that triggered it — the in-app notification above already
  // landed regardless.
  try {
    const ownerEmail = await getTenantOwnerEmail(supabase, tenantId);
    if (!ownerEmail) return;
    const label = KIND_LABEL[kind] ?? "Update";
    const html = `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1f;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #6b6b76; margin: 0 0 8px;">${label}</p>
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 8px;">${title}</p>
        ${body ? `<p style="color: #45454e; margin: 0 0 16px;">${body}</p>` : ""}
        <p style="font-size: 12px; color: #9a9aa6; margin-top: 24px;">Sent by Primue because this happened on your account.</p>
      </div>
    `;
    await sendEmail({ to: ownerEmail, subject: title, html });
  } catch {
    // Non-fatal — see comment above.
  }
}
