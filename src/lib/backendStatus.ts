// True once real Supabase credentials are set in .env.local (NEXT_PUBLIC_* vars
// are safe to read on the client — that's what they're for).
export const isBackendConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Google isn't enabled as a provider in Supabase yet (Authentication →
// Providers → Google needs a real Google Cloud OAuth client), so the button
// stays hidden rather than sending a real visitor to a raw Supabase error
// page. Flip this on once that's set up — no other code change needed.
export const isGoogleSignInConfigured = process.env.NEXT_PUBLIC_GOOGLE_SIGNIN_ENABLED === "true";
