# Supabase migrations

We use **two Supabase projects** (Option A): one for **development**, one for **production**. Same schema in both; separate data. No `SUPABASE_SCHEMA` or dev schema needed.

## Setup: two projects

1. **Development project**
   - In [Supabase Dashboard](https://supabase.com/dashboard), create a project (e.g. **scamenger-dev**).
   - In that project, open **SQL Editor** and run **`migrations/001_full_schema.sql`**.
   - Copy **Project URL** and **service_role** key from **Project Settings → API** into `backend/.env` for local development.

2. **Production project**
   - Create a second project (e.g. **scamenger-prod**).
   - Run **`migrations/001_full_schema.sql`** in its SQL Editor.
   - Use this project’s URL and service_role key in your production environment (e.g. Render **Environment**).

Local/dev uses the dev project; production uses the prod project. Same table names (`public.reports`, `public.report_raters`) in both.

## Truncate scripts

- **Production:** `scripts/truncate_all_tables.sql` — run in the **production** project’s SQL Editor when you need a clean slate.
- Use the same script in the **development** project if you want to reset dev data.

---

## 001_full_schema.sql

Creates the full schema (single migration): reports (including Facebook post tracking), report_raters, report_helpful_votes, contact_messages, site_settings. Run once per project.
