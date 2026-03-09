# Supabase table design — Scam Avenger

Overview: **reports** (anonymous submissions, with **aggregated** rating columns) and **report_raters** (who has rated — no per-user scores stored).

---

## 1. `public.reports`

User-submitted scam reports. No auth required to submit. **Aggregated ratings** are stored on this table. Created in **001_schema.sql**.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `slug` | TEXT | NO | — | Unique shareable slug (URLs use `?id=<uuid>` for viewing) |
| `country_origin` | TEXT | NO | — | Country of scam origin (required) |
| `report_type` | TEXT | NO | — | One of: `website`, `phone`, `crypto`, `iban`, `social_media`, `whatsapp`, `telegram`, `discord`, `other` (001_schema) |
| **`report_type_detail`** | TEXT | YES | — | Type-specific value: website URL, phone number, crypto address, or IBAN |
| `category` | TEXT | YES | — | Optional scam category |
| `lost_money` | BOOLEAN | NO | `false` | Reporter lost money (derived from `lost_money_range` when provided) |
| **`lost_money_range`** | TEXT | YES | — | Amount lost: `under_100`, `under_1000`, `under_10000`, `under_100000`, `under_1000000`, `over_1000000` |
| `narrative` | TEXT | YES | — | Free-text description |
| `consent_share_authorities` | BOOLEAN | NO | `false` | Consent to share with police/authorities |
| `created_at` | TIMESTAMPTZ | NO | `now()` | When the report was created |
| **`rating_count`** | INTEGER | NO | `0` | Number of users who rated (authenticated) |
| **`sum_credibility`** | INTEGER | NO | `0` | Sum of credibility scores (1–5) |
| **`sum_usefulness`** | INTEGER | NO | `0` | Sum of usefulness scores (1–5) |
| **`sum_completeness`** | INTEGER | NO | `0` | Sum of completeness scores (1–5) |
| **`sum_relevance`** | INTEGER | NO | `0` | Sum of relevance scores (1–5) |

**Computed (in API or view):**  
`avg_credibility = sum_credibility / NULLIF(rating_count, 0)` (and same for usefulness, completeness, relevance).

**Constraints**

- `report_type` CHECK: `'website' | 'phone' | 'crypto' | 'iban' | 'social_media' | 'whatsapp' | 'telegram' | 'discord' | 'other'` (001_schema)
- UNIQUE on `slug`

**Indexes**

- `idx_reports_slug`, `idx_reports_created_at`, `idx_reports_country_origin` (001_schema)

**RLS**

- INSERT: anyone (anonymous submit)
- SELECT: anyone (public read)
- UPDATE: typically via backend/service role only (when adding a new rating’s contribution to the sums and count)

---

## 2. `public.report_raters`

Tracks **which authenticated users have rated which report**. No rating values stored — only used to enforce **one rating per user per report** so the same user can’t add to the aggregate twice. Created in **001_schema.sql**.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `report_id` | UUID | NO | — | FK → `public.reports(id)` ON DELETE CASCADE |
| `user_id` | UUID | NO | — | FK → `auth.users(id)` ON DELETE CASCADE |
| `created_at` | TIMESTAMPTZ | NO | `now()` | When they rated |

**Constraints**

- PRIMARY KEY `(report_id, user_id)` — one row per user per report

**Indexes**

- `idx_report_raters_report_id`, `idx_report_raters_user_id`

**RLS**

- INSERT: authenticated, and `user_id = auth.uid()` (when user submits a rating for the first time)
- SELECT: authenticated, own rows only (e.g. “have I rated this report?”)

**Flow**

1. User submits a rating (credibility, usefulness, completeness, relevance, each 1–5).
2. Backend checks if `(report_id, user_id)` exists in `report_raters`.
3. If not: insert into `report_raters`, then update `reports` set  
   `rating_count = rating_count + 1`,  
   `sum_credibility = sum_credibility + :credibility`,  
   … (same for usefulness, completeness, relevance)  
   for that report.
4. If already exists: reject (already rated) or optionally allow “update” by storing previous values in app logic and adjusting sums (not in this design).

---

## 3. Entity relationship

```
auth.users (Supabase Auth)
    │
    │ 1 : N
    ▼
public.report_raters  ──── N : 1 ────► public.reports
  (report_id, user_id)                 (id, slug, ..., rating_count,
   [no score columns]                    sum_credibility, sum_usefulness,
                                        sum_completeness, sum_relevance)
```

- **reports**: one row per scam report; **aggregated** rating fields on this table only.
- **report_raters**: only records “user X has rated report Y”; no individual scores.

---

## 4. Migration order

1. **001_schema.sql** — Creates `reports` table (with report_type_detail, lost_money_range, full report_type CHECK) and RLS; creates `report_raters` table and RLS. Requires Supabase Auth enabled.

Run in Supabase SQL Editor (or via Supabase CLI).
