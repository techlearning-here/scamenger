# Seed Data

This document describes how to load and verify **initial/seed data** for Scam Avenger so the app starts with accurate, consistent data.

---

## What is seeded

| Data | Source | Purpose |
|------|--------|---------|
| **site_settings** | `supabase/seed/data.json` → `supabase/scripts/seed.sql` | Required keys: `show_facebook_consent`, `show_report_scam` (both boolean). Drives config API and report form visibility. |

The **canonical source of truth** for seed data is **`supabase/seed/data.json`**. The SQL in **`supabase/scripts/seed.sql`** must stay in sync with that file so the database gets accurate input.

---

## How to run seed

1. **Apply schema first** (if not already done):
   - Run **`supabase/migrations/001_full_schema.sql`** in the Supabase SQL Editor (or via CLI).

2. **Apply seed** (idempotent; safe to run more than once):
   - Run **`supabase/scripts/seed.sql`** in the Supabase SQL Editor, or:
   - `psql $DATABASE_URL -f supabase/scripts/seed.sql`

3. **Verify**:
   - Run **`supabase/scripts/verify_seed.sql`** in the SQL Editor. You should see exactly 2 rows: `show_facebook_consent` and `show_report_scam`, each with value `true`.

---

## Ensuring input data is accurate

1. **Single source of truth**  
   Edit **`supabase/seed/data.json`** for any change to canonical seed values. Then update **`supabase/scripts/seed.sql`** to match (same keys and values).

2. **Validation**  
   - After running `seed.sql`, run **`verify_seed.sql`** and confirm both keys exist and values are boolean `true`/`false`.  
   - The app expects `site_settings.value` to be JSONB that parses as boolean for these keys (see `backend/app/routers/config.py` and `backend/app/main.py`).

3. **Adding new seed data**  
   - Add the entry to **`supabase/seed/data.json`** (with a short `description`).  
   - Add the corresponding `INSERT` in **`supabase/scripts/seed.sql`** using `ON CONFLICT (key) DO NOTHING`.  
   - If the new data has constraints (e.g. enum), ensure the value in both JSON and SQL is valid.  
   - Run **`node supabase/seed/validate.js`** from the repo root to validate `data.json` (required keys and value types).

4. **Resetting to canonical values**  
   - To overwrite existing site_settings with the canonical seed (e.g. after manual changes):  
     - Truncate: `TRUNCATE TABLE public.site_settings;`  
     - Then run **`supabase/scripts/seed.sql`** again.

---

## File reference

| File | Role |
|------|------|
| **supabase/seed/data.json** | Canonical seed data (keys, values, descriptions). Edit this first when changing seed. |
| **supabase/scripts/seed.sql** | Idempotent SQL that applies seed to the DB. Keep in sync with `data.json`. |
| **supabase/scripts/verify_seed.sql** | Read-only checks: run after seed to confirm required rows exist and look correct. |
| **supabase/seed/validate.js** | Node script to validate `data.json` (required keys, value types). Run: `node supabase/seed/validate.js`. |
