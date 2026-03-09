# Supabase migrations

We use **two Supabase projects** (Option A): one for **development**, one for **production**. Same schema in both; separate data. No `SUPABASE_SCHEMA` or dev schema needed.

## Setup: two projects

1. **Development project**
   - In [Supabase Dashboard](https://supabase.com/dashboard), create a project (e.g. **scamenger-dev**).
   - In that project, open **SQL Editor** and run **`migrations/001_schema.sql`**.
   - Copy **Project URL** and **service_role** key from **Project Settings → API** into `backend/.env` for local development.

2. **Production project**
   - Create a second project (e.g. **scamenger-prod**).
   - Run **`migrations/001_schema.sql`** in its SQL Editor.
   - Use this project’s URL and service_role key in your production environment (e.g. Render **Environment**).

Local/dev uses the dev project; production uses the prod project. Same table names (`public.reports`, `public.report_raters`) in both.

## Truncate scripts

- **Production:** `scripts/truncate_all_tables.sql` — run in the **production** project’s SQL Editor when you need a clean slate.
- Use the same script in the **development** project if you want to reset dev data.

---

## 001_schema.sql

Creates the full schema:

**reports**
- `id`, `slug` – primary key and unique shareable slug (URLs use `?id=<uuid>`)
- `country_origin`, `report_type`, `report_type_detail`, `category`
- `lost_money`, `lost_money_range` – amount lost range: under_100, under_1000, etc.
- `narrative`, `consent_share_authorities`
- `created_at`
- Aggregated ratings: `rating_count`, `sum_credibility`, `sum_usefulness`, `sum_completeness`, `sum_relevance`

`report_type` allowed values: website, phone, crypto, iban, social_media, whatsapp, telegram, discord, other.

RLS: anonymous insert, public read.

**report_raters**
- `(report_id, user_id)` PRIMARY KEY — one rating per user per report
- RLS: authenticated users insert/read own rows

Requires Supabase Auth enabled for report_raters.

## 002_reports_status.sql

Adds **`status`** to `reports`: `pending` (default for new rows) or `approved`. Only approved reports are visible publicly. Run on both projects after 001. Existing rows get `approved`; new submissions need admin approval via the admin dashboard.
