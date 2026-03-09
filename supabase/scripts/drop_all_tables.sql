-- Drop all application tables (destructive).
-- Run in Supabase SQL Editor (Dashboard → SQL Editor) or via: psql $DATABASE_URL -f drop_all_tables.sql
-- Does NOT touch auth.users or other Supabase system tables.
-- After running, recreate schema with: supabase/migrations/001_schema.sql

-- Drop in dependency order: report_raters references reports.
DROP TABLE IF EXISTS public.report_raters CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
