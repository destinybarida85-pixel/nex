// True once real Supabase credentials are set in .env.local (NEXT_PUBLIC_* vars
// are safe to read on the client — that's what they're for).
export const isBackendConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
