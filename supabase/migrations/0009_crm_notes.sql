-- Richer deal details: free-text notes alongside the existing fields.
-- Run this once in the Supabase SQL editor, after 0008_stamp_credits.sql.

alter table deals add column if not exists notes text;
