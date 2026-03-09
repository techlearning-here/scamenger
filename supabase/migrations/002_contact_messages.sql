-- Contact form messages (admin can view/delete).
-- Run after 001_schema.sql (e.g. in Supabase SQL Editor).

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages (read);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Backend uses service_role for admin list/get/delete (bypasses RLS).
COMMENT ON TABLE public.contact_messages IS 'Contact form submissions; admin views and deletes via dashboard.';
