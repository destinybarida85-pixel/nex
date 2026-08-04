-- AI Assistant (/copilot) conversation memory.
-- Run this once in the Supabase SQL editor, after 0018_signature_seal_persistence.sql.
--
-- Every /copilot conversation used to live only in that browser tab's React
-- state — refresh the page, or come back tomorrow, and it was gone, with no
-- way to find a past conversation again or say whether the document it
-- pointed you toward actually turned out well. This is what backs the
-- history tab and the thumbs up/down rating.
--
-- The whole conversation is kept as one jsonb array rather than one row per
-- message: a conversation is always read and rewritten as a whole (there's
-- no per-message querying need), and jsonb keeps this consistent with how
-- certificates.style and signatures.stamp already store their own
-- variable-shaped, UI-driven data.
create table if not exists copilot_conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  title text not null default 'New conversation',
  messages jsonb not null default '[]'::jsonb,
  -- null = not rated yet, true = this led to a good document, false = it didn't.
  rating boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table copilot_conversations enable row level security;

drop policy if exists "copilot_conversations: tenant scoped" on copilot_conversations;
create policy "copilot_conversations: tenant scoped" on copilot_conversations
  for all using (tenant_id = auth_tenant_id());

select
  (select count(*) from information_schema.tables where table_name = 'copilot_conversations') as has_table;
