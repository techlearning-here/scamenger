-- Make name and email required on contact_messages (if 002 was run with nullable columns).
-- Run in Supabase SQL Editor only if you already ran 002_contact_messages.sql before name/email were NOT NULL.

-- Backfill any nulls (use empty string for existing rows)
UPDATE public.contact_messages SET name = '' WHERE name IS NULL;
UPDATE public.contact_messages SET email = '' WHERE email IS NULL;

ALTER TABLE public.contact_messages
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL;
