# Optimization Recommendations

Actionable improvements for performance, UX, and maintainability. Ordered by impact and effort.

---

## 1. Frontend – Performance

### 1.1 Font loading (high impact, low effort)

**Current:** Google Fonts loaded via `<link>` in layout; blocks render.

**Optimize:**
- Use Next.js `next/font` (e.g. `next/font/google`) for DM Sans so fonts are self-hosted and non-blocking.
- Reduces layout shift and improves LCP.

**File:** `frontend/app/layout.tsx`

### 1.2 Hero image (high impact, low effort)

**Current:** Home page uses `<img>` with external Unsplash URL; no Next.js Image optimization.

**Optimize:**
- Use `next/image` with the same URL and appropriate `sizes` (e.g. `100vw` or `(max-width: 768px) 100vw, 1200px`).
- Enables automatic format/quality and lazy-loading; improves LCP and CLS.

**File:** `frontend/app/page.tsx`

### 1.3 Lazy-load QR code on report detail (medium impact, low effort)

**Current:** `qrcode.react` is imported and rendered on every report view.

**Optimize:**
- Dynamic import: `const QRCodeSVG = dynamic(() => import('qrcode.react').then(m => m.QRCodeSVG), { ssr: false })` (or use Next.js `dynamic` with a small wrapper component).
- Reduces initial JS for users who never scroll to the share section.

**File:** `frontend/app/reports/ReportDetailClient.tsx`

### 1.4 Next.js config (medium impact, low effort)

**Current:** Minimal config (trailing slash, env).

**Consider adding:**
- `images.domains` (or `remotePatterns`) if you use `next/image` for external images (e.g. Unsplash, future CDN).
- `compiler.reactRemoveProperties` or other compiler opts only if you have specific needs.
- `experimental.optimizePackageImports: ['qrcode.react']` if you add more heavy libs.

**File:** `frontend/next.config.mjs`

---

## 2. Frontend – Data & Caching

### 2.1 Report lookup – cache “not found” (medium impact, low effort)

**Current:** Lookup form calls API every time; repeated invalid IDs hit the API repeatedly.

**Optimize:**
- In-memory (or sessionStorage) cache of recently looked-up IDs that returned 404, and skip API call for a short TTL (e.g. 60s). Still show “No report found” without a network request.

**File:** `frontend/app/lookup-report/LookupReportForm.tsx`

### 2.2 Report detail – optional client cache (low–medium impact)

**Current:** Every visit to `/reports/?id=...` refetches.

**Optimize:**
- Use React Query, SWR, or a simple in-memory cache keyed by `id` + `view_token` so back navigation reuses data when still “fresh” (e.g. 1–2 minutes). Reduces repeat requests when users navigate back from report to lookup and open the same report again.

### 2.3 Home page – avoid duplicate work (low effort)

**Current:** `getOrderedTopics()` and `getUsScamTypes()` are called multiple times on the home page.

**Optimize:**
- Call `getUsScamTypes()` once, derive ordered topics and popular guides from that result in the same component. Reduces work and keeps a single source of truth.

**File:** `frontend/app/page.tsx`

---

## 3. Frontend – UX & Resilience

### 3.1 Report detail – link back to lookup (low effort)

**Current:** “Report not found” and error states link to “Report a scam”.

**Optimize:**
- Add a link to “Look up report” (`/lookup-report/`) so users can try another ID without using the main nav.

**File:** `frontend/app/reports/ReportDetailClient.tsx`

### 3.2 Admin dashboard – load tabs on demand (medium effort)

**Current:** Pending, rejected, and approved lists + stats all load in one `Promise.all` on mount and on tab/page change.

**Optimize:**
- Load only the visible tab (e.g. pending) initially; load rejected/approved when user switches tabs. Keeps first load lighter and avoids unnecessary requests for users who only check pending.

**File:** `frontend/app/z7k2m9/page.tsx`

### 3.3 CountryTopicsClient – avoid null flash (low effort)

**Current:** Returns `null` until mounted, then shows content. Can cause layout shift.

**Optimize:**
- Render a same-height placeholder (e.g. skeleton or “Choose your country” with disabled select) during SSR/hydration so layout is stable when the client takes over.

**File:** `frontend/app/CountryTopicsClient.tsx`

---

## 4. Backend – API

### 4.1 CORS (security / config)

**Current:** `allow_origins=["*"]`.

**Optimize:**
- In production, set `allow_origins` to the exact frontend origin(s) (e.g. from env). Keeps flexibility for dev while locking down prod.

**File:** `backend/app/main.py`

### 4.2 Report by ID – caching (medium impact)

**Current:** Every GET `/reports/{id}` hits the DB.

**Optimize:**
- Add short-lived HTTP cache headers for approved reports (e.g. `Cache-Control: public, max-age=60` or 300). Pending/reject or token-based views can remain uncached. Reduces load for popular reports.

**File:** Backend report router (where report by ID is returned).

### 4.3 Health check – minimal dependency

**Current:** Health returns 200 with `{"status": "ok"}`.

**Optimize:**
- If you add DB or external deps, consider a separate “ready” endpoint that checks DB connectivity; keep `/health` fast and dependency-free for load balancers.

---

## 5. Code Quality & Maintainability

### 5.1 Shared date formatting

**Current:** `formatDate` (and similar) duplicated in `ReportDetailClient.tsx` and admin page.

**Optimize:**
- Move to a shared util (e.g. `frontend/src/lib/format.ts`) and reuse. Reduces drift and keeps formatting consistent.

### 5.2 Report types/labels – tree-shaking

**Current:** Large imports from `@/data/reports/api` (e.g. `REPORT_TYPE_LABELS`, `LOST_MONEY_RANGE_LABELS`, etc.).

**Optimize:**
- Already a single module; if bundle size grows, consider splitting “labels only” vs “API + types” so pages that only need labels don’t pull in fetch logic. Measure first with `next build` / analyzer.

### 5.3 Scam data size

**Current:** `frontend/src/data/scams/data.ts` is a large static array.

**Optimize:**
- Ensure scam detail pages (e.g. `/us/scams/[slug]`) don’t pull the full array if they can get one item by slug from a smaller map or API. If all guides are needed for the home page, consider loading heavy narrative content only on the detail page (e.g. via dynamic import or a small JSON endpoint).

---

## 6. SEO & Accessibility (already in good shape)

- Metadata, canonical, OG, and JSON-LD are set.
- Semantic HTML and ARIA are used in key flows.
- Consider adding a skip link (“Skip to main content”) for keyboard users; layout already has a clear main landmark.

---

## Quick wins (do first)

1. Switch layout to `next/font` for DM Sans.
2. Use `next/image` for the home hero image.
3. Call `getUsScamTypes()` once on the home page and derive topics/guides from it.
4. Add “Look up report” link on report detail error/not-found views.
5. Tighten CORS in production to the real frontend origin(s).

After that, prioritize based on metrics (e.g. LCP, API latency, admin usage): lazy-load QR, cache report lookup 404s, cache GET report by ID, and tab-based loading in admin.
