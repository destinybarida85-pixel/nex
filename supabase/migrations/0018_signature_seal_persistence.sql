-- Persist the actual signature and stamp appearance, not just proof they happened.
-- Run this once in the Supabase SQL editor, after 0017_certificate_styles.sql.
--
-- Until now, signing a document only ever stored signature_hash (a one-way
-- hash) and a stamp_applied boolean. That's enough to prove a signing
-- happened, but nowhere near enough to redraw the actual signature and stamp
-- when someone reopens the document later — which is exactly what CompleteStep
-- was doing from live, never-persisted React state. Reload the page, or open
-- the same /sign/[id] link again after it's fully signed, and the visual
-- signature+stamp were simply gone, even though the document really was
-- signed and sealed.
--
-- signature_image holds the actual signature (a drawn/uploaded image data URL,
-- or the typed name string for "type" mode) — same value already sent to this
-- endpoint as signatureData, just kept instead of only hashed.
--
-- stamp is a single jsonb blob (label, sub, shape, color, position, x, y,
-- imageUrl) for the same reason certificates.style is jsonb: stamp
-- presentation is a UI concern that changes often and shouldn't need a
-- migration for every new field.
alter table signatures add column if not exists signature_image text;
alter table signatures add column if not exists stamp jsonb;

select
  (select count(*) from information_schema.columns
     where table_name = 'signatures' and column_name = 'signature_image') as has_signature_image,
  (select count(*) from information_schema.columns
     where table_name = 'signatures' and column_name = 'stamp') as has_stamp_column;
