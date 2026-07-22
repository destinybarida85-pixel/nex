import { createClient } from "@supabase/supabase-js";

// Service-role client: full access, bypasses Row Level Security.
// Server-side only — never import this from a Client Component or expose the key to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
