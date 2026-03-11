-- Seed initial data (idempotent).
-- Run after supabase/migrations/001_full_schema.sql.
-- Canonical source: supabase/seed/data.json. Keep this file in sync with that JSON.
-- Use ON CONFLICT DO NOTHING so existing rows are not overwritten (safe to re-run).
-- To reset to canonical values, truncate site_settings first, then run this script.

-- =============================================================================
-- SITE_SETTINGS (required keys; value is JSONB: true/false)
-- =============================================================================
INSERT INTO public.site_settings (key, value)
VALUES
  ('show_facebook_consent', 'true'::jsonb),
  ('show_report_scam', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
