import { createClient } from "@/lib/supabase/server";
import { isPendingMigration } from "@/lib/schema";

// Resolves the caller's Supabase session and their tenant_id in one call.
// Every real (non-public) API route uses this instead of trusting a client-supplied
// tenant id, so a user can never read or write another tenant's data by guessing an id.
export async function requireTenant() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not signed in.", status: 401 as const, supabase: null, tenantId: null, userId: null };
  }

  const { data: profile } = await supabase.from("profiles").select("tenant_id").eq("id", user.id).single();

  if (!profile?.tenant_id) {
    return { error: "No tenant found for this account.", status: 404 as const, supabase: null, tenantId: null, userId: null };
  }

  // The Super Admin "Suspend tenant" action sets this — checked on every
  // request rather than only at sign-in so a suspension takes effect
  // immediately for someone already mid-session, not on their next login.
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("suspended")
    .eq("id", profile.tenant_id)
    .maybeSingle();
  if (!isPendingMigration(tenantError) && tenant?.suspended) {
    return { error: "This account has been suspended.", status: 403 as const, supabase: null, tenantId: null, userId: null };
  }

  return { error: null, status: 200 as const, supabase, tenantId: profile.tenant_id as string, userId: user.id };
}
