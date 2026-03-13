# Caching and DB Access

**Goal:** Minimize database access. Config and read-heavy report data are cached in the backend and (where applicable) in the frontend.

---

## 1. What Is Cached

### Backend

| What | Where | TTL / size | Invalidation |
|------|--------|------------|---------------|
| **Public config** (`show_facebook_consent`, `show_report_scam`) | `app/cache.py` — in-memory dict | 300 seconds (5 min) | On admin PATCH `/z7k2m9/settings` via `invalidate_config_cached()` |
| **Report by ID** | `app/cache.py` — LRU, keyed by report UUID | Max 1000 entries (oldest evicted) | Updated on create/update/rate/helpful; invalidated on admin approve/reject/delete |

**Endpoints that use cache (no DB on hit):**

- `GET /config` — returns cached config if present and not expired; else reads `site_settings`, then fills cache.
- `GET /z7k2m9/settings` (admin) — returns from same config cache when present; else reads `site_settings`, fills cache, then returns.
- `GET /reports/{report_id}` — returns from report cache if present; else reads `reports` table, then fills cache. When returning from cache, it may still hit DB for `similar_count` (if report has `report_type_detail`) and for `user_rating` (if authenticated).

### Frontend

| What | Where | TTL | Invalidation |
|------|--------|-----|--------------|
| **Public config** | `src/data/config/api.ts` — in-memory `cachedConfig` | 2 minutes | `invalidateConfigCache()` after admin updates settings |

**Usage:** `getConfig()` is used by the report form (e.g. Facebook consent, “Report a scam” visibility). Repeated calls within 2 minutes reuse the same value and do not call the backend.

---

## 2. Where the DB Is Still Hit (Every Request or Often)

| Endpoint / flow | DB access | Cached? |
|-----------------|-----------|----------|
| `GET /config` (cache miss) | `site_settings` (2 keys) | Yes, after first miss (backend 60s, frontend 2 min) |
| `GET /reports/{id}` (cache miss) | `reports` by id | Yes, after first miss (LRU) |
| `GET /reports/{id}` (cache hit) | Optional: `reports` (similar_count), `report_raters` (user_rating) | No — one query per approved report with detail; one per authenticated user for rating |
| `GET /reports/{id}/helpful` | `reports` (id/status), `report_helpful_votes` (counts + user vote) | No |
| `POST /reports` (create) | `reports` insert | N/A (write) |
| `POST /reports/{id}/rate` | `reports` select + update, `report_raters` select/insert/update | Report row updated in cache after |
| `POST /reports/{id}/helpful` | `reports` (id/status), `report_helpful_votes` upsert + counts | No |
| `GET /z7k2m9/settings` (admin) | `site_settings` (2 keys) when config cache miss | Yes (uses same config cache; DB only on miss) |
| `PATCH /z7k2m9/settings` (admin) | `site_settings` upsert + invalidates config cache | N/A (write) |
| Admin: contact messages list / get / mark read / delete | `contact_messages` | No (admin-only, lower volume) |
| Admin: reports list / get / approve / reject / delete | `reports`, `report_raters`, etc. | Report by id cached after approve/reject/update |
| `POST /contact` | `contact_messages` insert | N/A (write) |

---

## 3. Summary

- **Config:** Cached in backend (5 min) and frontend (2 min). DB is only hit on cold start or after admin changes settings (and only until next backend read within 5 min). Admin GET settings uses the same cache.
- **Report by ID:** Cached in backend (LRU 1000). DB is hit on cache miss; on cache hit, DB can still be used for `similar_count` and `user_rating`.
- **All other reads** (admin settings, contact list, report list, helpful counts, etc.) hit the DB every time.

To **maximize cache usage and minimize DB:**

1. Keep using the existing config and report caches (already in place).
2. Backend config TTL is 300s; admin GET settings uses the same cache (done).
3. Optionally cache `similar_count` per report (e.g. short TTL or when returning report from cache) to avoid an extra DB query on every cache hit for reports with `report_type_detail`.
4. Writes (create report, rate, helpful, contact, admin updates) must hit the DB; only reads can be cached.

---

## 4. Code References

| Layer | File | Notes |
|-------|------|--------|
| Backend cache | `backend/app/cache.py` | `CONFIG_CACHE_TTL_SECONDS`, `REPORT_CACHE_MAXSIZE`, get/set/invalidate for config and report |
| Backend config usage | `backend/app/main.py` (`/config`), `backend/app/routers/config.py` | Both use `get_config_cached` / `set_config_cached` |
| Backend report usage | `backend/app/routers/reports.py` | `get_report_cached`, `set_report_cached`, `invalidate_report_cached` |
| Backend invalidation | `backend/app/routers/admin.py` | `invalidate_config_cached` on PATCH settings; `invalidate_report_cached` / `set_report_cached` on report updates |
| Frontend config | `frontend/src/data/config/api.ts` | `CONFIG_CACHE_TTL_MS`, `getConfig()`, `invalidateConfigCache()` |
| Frontend invalidation | `frontend/app/z7k2m9/page.tsx` (admin) | Calls `invalidateConfigCache()` after saving settings |
