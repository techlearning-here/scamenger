# Scam Avenger — Feature List

Consolidated feature list from NewFeatures.md (ScamAdviser-inspired) and readme_New_UX.md (UX/design).

---

## 0. Top priority — Report scams platform

User-reported scams with shareable links; **anyone can submit a report without signing in.** Authenticated ratings help reduce fraudulent reporting; privacy-safe aggregated trends. **Tech stack:** Supabase (data storage), backend on Render, frontend (Next.js) on Vercel.

| # | Feature | Description |
|---|---------|-------------|
| **P0** | **Report scams + shareable URL** | User submits a report **without creating an account or signing in** and receives a unique URL (e.g. `/reports/{report-id}`). Each report captures **country of scam origin** (where the scam appears to originate or primarily targets). They can share this link so others can find and reference the report. |
| **P0** | **Authenticated view + ratings** | Only authenticated users can open a report and rate it. Ratings use **1–5 stars** on four dimensions: **Credibility** (believable/accurate?), **Usefulness** (helpful to others?), **Completeness** (information complete?), **Relevance** (e.g. “This happened to me too” = 5, “Not relevant” = 1). One rating per user per report. Ratings help surface fraudulent or low-quality reports and improve trust. See **docs/ReportRatingCategories.md**.
| **P0** | **Aggregated public trends** | Public-facing dashboard or pages show **aggregated** data only: no specifics, no victim descriptions, no PII. Show trends (e.g. scam types over time, **regions/countries of origin**, categories) to inform the community and authorities without exposing individual reports. |
| **P0** | **Stack** | **Supabase** — reports, users, ratings, and analytics tables. **Backend** — hosted on **Render** (API/serverless for auth, report creation, aggregation). **Frontend** — **Next.js** app hosted on **Vercel**. |

---

## 1. Search & Discovery

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Unified scam checker** | "Paste anything suspicious" — single search bar instead of dropdown. Users paste website, phone, crypto wallet, or IBAN. |
| 2 | **Search-first approach** | Prominent search bar: "What happened to you?" — natural-language input so users describe their scam instead of browsing categories. Reduces stress for victims who don't know category names. |
| 3 | **Country auto-detection** | Use `navigator.language` or IP geolocation to pre-select country and reduce friction. |

---

## 2. Guided Experience & Reporting

| # | Feature | Description |
|---|---------|-------------|
| 4 | **Wizard / guided flow** | Step-by-step questionnaire (e.g. "Did you lose money? → Was it online or by phone? → …") that routes users to the right reporting channel. Reduces cognitive load. *Unique angle vs ScamAdviser.* |
| 5 | **Progress indication** | After selecting a scam type, show clear "what happens next": Report → Track → Prevent. |
| 6 | **Estimated time to report** | Add labels like "~5 min" next to reporting links to set expectations. |

---

## 3. Scam Education & Categories

| # | Feature | Description |
|---|---------|-------------|
| 7 | **Card-based scam categories** | Replace flat link list with visual cards and icons (e.g. phishing, bank fraud, romance). More scannable and tappable on mobile. |
| 8 | **Scam category education** | Card-based guides per scam type with clear action steps (inspired by Shopping, Financial, Dating, Gambling, Employment categories). |
| 9 | **Niche scam tools** | Dedicated tools (e.g. Romance Scam Checker) for SEO and engagement. |
| 10 | **Scam prevalence badges** | "Most reported" or "Trending" tags on high-volume scam types to help users validate their experience. |

---

## 4. Community & Social Proof

| # | Feature | Description |
|---|---------|-------------|
| 11 | **Community scam reports** | User-submitted reports with a "Latest Reports" feed — builds SEO and social proof. |
| 12 | **Report scams form** | "Seen something suspicious? Share to protect!" — form to submit scam details: **country of scam origin** (required), report type (website, phone, crypto address, or IBAN; "+ Add more" for multiple), scam category + subcategory dropdowns, "Lost money?" option, free-text narrative ("How did you get in contact? What happened next?"), and optional consent to share the report with police and crime-fighting agencies. Feeds into the community reports feed (#11). |
| 13 | **Live stats dashboard** | Public metrics (e.g. "X reports, Y scam types, Z visits") to build authority. |
| 14 | **Press / review badges** | Press logos (e.g. Time, Yahoo Finance) and links to Trustpilot, SiteJabber, Google Reviews for credibility. |
| 15 | **Newsletter signup** | Email list for recurring traffic and monetizable audience. |

---

## 5. Content & SEO

| # | Feature | Description |
|---|---------|-------------|
| 16 | **Scam alerts blog** | Trending scam articles (e.g. Amazon, Coinbase, crypto) as SEO traffic driver and ad revenue. |
| 17 | **Global country guide** | Per-country pages for long-tail SEO. |

---

## 6. Visual & Emotional Design

| # | Feature | Description |
|---|---------|-------------|
| 18 | **Warmer, reassuring tone** | Calming colors (teal/green), empathetic copy ("You're not alone — let's fix this"), trust indicators (shield icons, "100% free, no data collected"). |
| 19 | **Hero section redesign** | Replace generic stock photo with bold illustration or icon-driven hero: "report → get help → stay safe." |
| 20 | **Sticky "Need help now?" CTA** | Floating button to emergency contacts (e.g. bank fraud hotlines) for users in active crisis. |
| 21 | **Breadcrumb trail** | Inner pages show path (Home → US → Phishing) for easy backtracking. |

---

## 7. Mobile & Accessibility

| # | Feature | Description |
|---|---------|-------------|
| 22 | **Mobile-first layout** | Single-column stack with large touch targets (48px+ height); fix 2-column grid break on small screens. |
| 23 | **Trust score / indicators** | Start with curated trust indicators; grow with community data (lighter version of algorithmic trust rating). |

---

## 8. Revenue-Enabling Features

| # | Feature | Revenue model |
|---|---------|----------------|
| 24 | **Claim your business** | Businesses pay to verify or manage their listing (B2B). |
| 25 | **Data services / API** | Sell scam data to ad networks, law enforcement, brands. |
| 26 | **Mobile app** | App installs for push notifications and higher engagement. |

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

*Last updated from NewFeatures.md and readme_New_UX.md.*
