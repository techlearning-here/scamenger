-- Truncate all application data (for a clean slate / production-ready DB).
-- Run in Supabase SQL Editor (Dashboard → SQL Editor) or via: psql $DATABASE_URL -f truncate_all_tables.sql
-- Does NOT touch auth.users or other Supabase system tables.

-- Truncate in dependency order: report_raters references reports; CASCADE clears dependent tables.
TRUNCATE TABLE public.reports RESTART IDENTITY CASCADE;

-- Optional: verify tables are empty
-- SELECT 'reports' AS tbl, count(*) FROM public.reports
-- UNION ALL
-- SELECT 'report_raters', count(*) FROM public.report_raters;
