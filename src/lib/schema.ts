// Migrations in this project are applied by hand in the Supabase SQL editor,
// so there is always a real window where deployed code is ahead of the
// database. These guards let a route detect that specific situation and say so
// plainly, instead of surfacing a raw Postgres error or — worse — silently
// falling back to a demo state that looks like the feature is just broken.
//
// Matching on code alone is not enough. Supabase goes through PostgREST, which
// answers from a cached schema and reports its own codes for things it can't
// find (PGRST204 for a column, PGRST205 for a table) rather than passing
// through Postgres's 42703 / 42P01. Verified against production: a missing
// table surfaces as "Could not find the table 'public.x' in the schema cache",
// not as 42P01. So these check both the codes and the message shape.

type DbError = { code?: string; message?: string } | null | undefined;

const MISSING_COLUMN_CODES = new Set(["42703", "PGRST204"]);
const MISSING_TABLE_CODES = new Set(["42P01", "PGRST205"]);

function saysNotFoundInSchemaCache(error: DbError, what: "column" | "table") {
  const msg = error?.message?.toLowerCase() ?? "";
  return msg.includes("could not find") && msg.includes(what);
}

export function isMissingColumn(error: DbError) {
  return (!!error?.code && MISSING_COLUMN_CODES.has(error.code)) || saysNotFoundInSchemaCache(error, "column");
}

export function isMissingTable(error: DbError) {
  return (!!error?.code && MISSING_TABLE_CODES.has(error.code)) || saysNotFoundInSchemaCache(error, "table");
}

/** True when the failure is "this migration hasn't been run yet". */
export function isPendingMigration(error: DbError) {
  return isMissingColumn(error) || isMissingTable(error);
}
