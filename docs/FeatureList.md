# Scam Avenger — Feature List

Consolidated feature list from NewFeatures.md (ScamAdviser-inspired) and readme_New_UX.md (UX/design). **Status** reflects current implementation (from MISSING_FEATURES_FROM_NEW_UX.md): **Done** = implemented, **Partial** = partly there, **Missing** = not built, **Unverified** = not audited, **Planned** = backlog.

---

## 0. Top priority — Report scams platform

User-reported scams with shareable links; **anyone can submit a report without signing in.** Authenticated ratings help reduce fraudulent reporting; privacy-safe aggregated trends. **Tech stack:** Supabase (data storage), backend on Render, frontend (Next.js) on Vercel.

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| **P0** | **Report scams + shareable URL** | User submits a report **without creating an account or signing in** and receives a unique URL (e.g. `/reports/{report-id}`). Each report captures **country of scam origin** (where the scam appears to originate or primarily targets). They can share this link so others can find and reference the report. | Done |
| **P0** | **Authenticated view + ratings** | Only authenticated users can open a report and rate it. Ratings use **1–5 stars** on four dimensions: **Credibility** (believable/accurate?), **Usefulness** (helpful to others?), **Completeness** (information complete?), **Relevance** (e.g. "This happened to me too" = 5, "Not relevant" = 1). One rating per user per report. Ratings help surface fraudulent or low-quality reports and improve trust. See **docs/ReportRatingCategories.md**. | Done |
| **P0** | **Aggregated public trends** | Public-facing dashboard or pages show **aggregated** data only: no specifics, no victim descriptions, no PII. Show trends (e.g. scam types over time, **regions/countries of origin**, categories) to inform the community and authorities without exposing individual reports. | Partial |
| **P0** | **Stack** | **Supabase** — reports, users, ratings, and analytics tables. **Backend** — hosted on **Render** (API/serverless for auth, report creation, aggregation). **Frontend** — **Next.js** app hosted on **Vercel**. | Done |

---

## 1. Search & Discovery

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 1 | **Unified scam checker** | "Paste anything suspicious" — single search bar instead of dropdown. Users paste website, phone, crypto wallet, or IBAN. | Missing |
| 2 | **Search-first approach** | Prominent search bar: "What happened to you?" — natural-language input so users describe their scam instead of browsing categories. Reduces stress for victims who don't know category names. | Missing |
| 2b | **Replace category dropdown with search** | Report form uses search/natural language to suggest categories or reporting channels instead of (or in addition to) Scam category + Report type dropdowns. | Missing |
| 3 | **Country auto-detection** | Use `navigator.language` or IP geolocation to pre-select country and reduce friction. | Done |

---

## 2. Guided Experience & Reporting

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 4 | **Wizard / guided flow** | Step-by-step questionnaire (e.g. "Did you lose money? → Was it online or by phone? → …") that routes users to the right reporting channel. Reduces cognitive load. *Unique angle vs ScamAdviser.* | Missing |
| 4b | **Route to right reporting channel via questions** | Wizard or flow that asks questions and then recommends a specific scam guide or reporting link (e.g. FTC, IC3). Scam type pages already list links; no question-based routing yet. | Partial |
| 5 | **Progress indication** | After selecting a scam type, show clear "what happens next": Report → Track → Prevent. | Missing |
| 6 | **Estimated time to report** | Add labels like "~5 min" next to reporting links to set expectations. | Missing |

---

## 3. Scam Education & Categories

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 7 | **Card-based scam categories** | Replace flat link list with visual cards and icons (e.g. phishing, bank fraud, romance). More scannable and tappable on mobile. | Partial |
| 8 | **Scam category education** | Card-based guides per scam type with clear action steps (inspired by Shopping, Financial, Dating, Gambling, Employment categories). | Done |
| 9 | **Niche scam tools** | Dedicated tools (e.g. Romance Scam Checker) for SEO and engagement. | Planned |
| 10 | **Scam prevalence badges** | "Most reported" or "Trending" tags on high-volume scam types to help users validate their experience. | Missing |

---

## 4. Community & Social Proof

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 11 | **Community scam reports** | User-submitted reports with a "Latest Reports" feed — builds SEO and social proof. | Partial |
| 12 | **Report scams form** | "Seen something suspicious? Share to protect!" — form to submit scam details: **country of scam origin** (required), report type (website, phone, crypto address, or IBAN; "+ Add more" for multiple), scam category + subcategory dropdowns, "Lost money?" option, free-text narrative ("How did you get in contact? What happened next?"), and optional consent to share the report with police and crime-fighting agencies. Feeds into the community reports feed (#11). | Done |
| 13 | **Live stats dashboard** | Public metrics (e.g. "X reports, Y scam types, Z visits") to build authority. | Partial |
| 14 | **Press / review badges** | Press logos (e.g. Time, Yahoo Finance) and links to Trustpilot, SiteJabber, Google Reviews for credibility. | Planned |
| 15 | **Newsletter signup** | Email list for recurring traffic and monetizable audience. | Planned |

---

## 5. Content & SEO

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 16 | **Scam alerts blog** | Trending scam articles (e.g. Amazon, Coinbase, crypto) as SEO traffic driver and ad revenue. | Partial |
| 17 | **Global country guide** | Per-country pages for long-tail SEO. | Partial |

---

## 6. Visual & Emotional Design

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 18 | **Warmer, reassuring tone** | Calming colors (teal/green), empathetic copy ("You're not alone — let's fix this"), trust indicators (shield icons, "100% free, no data collected"). | Missing |
| 18b | **Trust indicators** | Visible "100% free, no data collected" or shield-style trust badges on report flow or hero. | Partial |
| 19 | **Hero section redesign** | Replace generic stock photo with bold illustration or icon-driven hero: "report → get help → stay safe." | Missing |
| 20 | **Sticky "Need help now?" CTA** | Floating button to emergency contacts (e.g. bank fraud hotlines) for users in active crisis. | Done |
| 21 | **Breadcrumb trail** | Inner pages show path (Home → US → Phishing) for easy backtracking. | Partial |

---

## 7. Mobile & Accessibility

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 22 | **Mobile-first layout** | Single-column stack with large touch targets (48px+ height); fix 2-column grid break on small screens. | Unverified |
| 22b | **Large touch targets (48px+)** | Audit and ensure buttons/links meet 48px+ height for touch. | Unverified |
| 23 | **Trust score / indicators** | Start with curated trust indicators; grow with community data (lighter version of algorithmic trust rating). | Partial |

---

## 8. Revenue-Enabling Features

| # | Feature | Revenue model | Status |
|---|---------|----------------|--------|
| 24 | **Claim your business** | Businesses pay to verify or manage their listing (B2B). | Planned |
| 25 | **Data services / API** | Sell scam data to ad networks, law enforcement, brands. | Planned |
| 26 | **Mobile app** | App installs for push notifications and higher engagement. | Planned |

---

## Recommended priority (from NewFeatures.md)

| Phase | Focus |
|-------|--------|
| **Top priority** | **Report scams platform (P0)** — Shareable report URLs (submit without signing in), authenticated view + ratings (fraud mitigation), aggregated public trends (no specifics). Stack: Supabase + backend (Render) + frontend (Next.js on Vercel). |
| **Phase 1 (MVP)** | Unified scam checker (#1) + Report scams form (#12) + Community reports (#11) + Scam category cards (#7/#8) + Country guide (#17) |
| **Phase 2** | Blog/alerts (#16) + Live stats (#13) + Newsletter (#15) |
| **Phase 3** | B2B "Claim your site" (#24) + API (#25) + Mobile app (#26) |

**Differentiator:** The "I got scammed → what do I do now?" guided wizard (#4) remains a unique angle vs ScamAdviser.

---

## Status summary (from MISSING_FEATURES_FROM_NEW_UX.md)

| Status | Count | Examples |
|--------|-------|----------|
| Done | 7 | P0 report + shareable URL, auth ratings, Stack, Report form (#12), Scam category education (#8), "Need help now?" CTA (#20), Country auto-detection (#3) |
| Partial | 10 | Aggregated trends, Card-based categories (#7), Route to channel (#4b), Trust indicators (#18b), Breadcrumb (#21), Community reports (#11), Live stats (#13), Blog (#16), Country guide (#17), Trust score (#23) |
| Missing | 12 | Search-first (#2), Replace dropdown (#2b), Wizard (#4), Progress (#5), Estimated time (#6), Prevalence badges (#10), Warmer tone (#18), Hero redesign (#19), Unified scam checker (#1) |
| Unverified | 2 | Mobile-first (#22), 48px touch targets (#22b) |
| Planned | 5 | Niche tools (#9), Press badges (#14), Newsletter (#15), Revenue (#24–26) |

*Last updated from NewFeatures.md, readme_New_UX.md, and MISSING_FEATURES_FROM_NEW_UX.md.*
