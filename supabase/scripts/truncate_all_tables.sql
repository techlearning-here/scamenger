-- Truncate all application data (for a clean slate / production-ready DB).
-- Run in Supabase SQL Editor (Dashboard → SQL Editor) or via: psql $DATABASE_URL -f truncate_all_tables.sql
-- Does NOT touch auth.users or other Supabase system tables.
-- CASCADE on reports clears report_raters and report_helpful_votes; contact_messages and site_settings are truncated explicitly.
TRUNCATE TABLE public.reports, public.contact_messages, public.site_settings RESTART IDENTITY CASCADE;
