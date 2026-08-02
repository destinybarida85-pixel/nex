// Two-party signing adds a `signers_required` column to `documents`
// (supabase/migrations/0015_two_party_signing.sql). Migrations here are applied
// by hand in the Supabase SQL editor, so there is a real window where the
// deployed code is ahead of the database.
//
// Rather than let that window break document sending outright, every read and
// write of the new column goes through these helpers: if Postgres reports the
// column doesn't exist (42703), fall back to the old single-signer behaviour.
// Once the migration is run the fallback simply stops being hit.

export const UNDEFINED_COLUMN = "42703";

export function isMissingColumn(error: { code?: string } | null | undefined) {
  return error?.code === UNDEFINED_COLUMN;
}
