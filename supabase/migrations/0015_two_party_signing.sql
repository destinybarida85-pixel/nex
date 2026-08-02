-- Two-party signing.
-- Run this once in the Supabase SQL editor, after 0014_document_payment_links.sql.
--
-- The signatures table was already a chain (each row links to the previous via
-- previous_hash), so more than one signature per document has always been
-- storable. What blocked it was the sign API marking a document 'signed' on the
-- very first signature, which the /sign page then refuses to reopen.
--
-- signers_required records the sender's intent up front, so the API knows
-- whether a first signature completes the document or is only half of it.

alter table documents add column if not exists signers_required smallint not null default 1;

alter table documents drop constraint if exists documents_signers_required_check;
alter table documents add constraint documents_signers_required_check
  check (signers_required between 1 and 2);

-- 'partially_signed' is a real state, not a cosmetic label: it's what keeps a
-- half-signed document open for the second party while still being clearly
-- distinct from an untouched 'sent'.
alter table documents drop constraint if exists documents_status_check;
alter table documents add constraint documents_status_check
  check (status in ('draft', 'sent', 'partially_signed', 'signed', 'void'));
