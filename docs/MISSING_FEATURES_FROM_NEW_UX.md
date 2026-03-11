# Missing Features (from readme_New_UX.md + newfeatures2.md + newfeature3.md)

This document lists features described in **readme_New_UX.md**, **newfeatures2.md**, and **newfeature3.md** that are **not yet implemented** or only **partially implemented**. Use it for prioritization and sprint planning.

---

## 1. Search-first approach

| Item | Status | Notes |
|------|--------|--------|
| **Prominent search bar ("What happened to you?")** | **Missing** | No site-wide search bar. Report form has a narrative field ("What happened?") but no natural-language search that replaces category browsing. |
| **Replace category dropdown with search** | **Missing** | Report form still uses a **Scam category** dropdown and **Report type** dropdown; no "describe your scam in natural language" search that suggests categories or reporting channels. |

**To implement:** Add a prominent search input on the homepage (and optionally report flow) that accepts free text and either (a) suggests scam types/guides, or (b) routes to a wizard step. Backend could use keyword matching, static mapping, or later a small ML/semantic layer.

---

## 2. Wizard / guided flow

| Item | Status | Notes |
|------|--------|--------|
| **Step-by-step questionnaire** | **Missing** | No multi-step flow like "Did you lose money? → Was it online or by phone? → ...". |
| **Route users to the right reporting channel** | **Partial** | Scam type pages (e.g. `/us/scams/phishing/`) list reporting links (FTC, IC3, etc.), but there is no wizard that asks questions and then recommends a specific channel or page. |

**To implement:** Add a wizard (e.g. `/report/guided/` or steps on the report page) with 3–5 yes/no or multiple-choice questions, then redirect to the most relevant scam guide or reporting link. Content can be driven from existing scam data or a new JSON structure.

---

## 3. Visual & emotional design

| Item | Status | Notes |
|------|--------|--------|
| **Warmer, reassuring tone** | **Missing** | Copy is factual; no explicit empathetic line like "You're not alone — let's fix this." No teal/green calming palette; current theme is blue/white (USWDS-style). |
| **Trust indicators** | **Partial** | No visible "100% free, no data collected" or shield-style trust badges on report flow or hero. |
| **Hero section redesign** | **Missing** | Hero still uses a **generic stock photo** (Unsplash). New UX asks for a **bold illustration or icon-driven hero** that communicates "report → get help → stay safe." |
| **Card-based scam categories with icons** | **Partial** | Home has **top-scam-stats-card** (value + label + name) and **popular-guides-list** (flat link list). No per-category icons (e.g. phishing, bank fraud, romance) or clearly card-based category grid with icons. |

**To implement:** (1) Introduce a warmer palette and empathetic hero/CTA copy; (2) Add trust line + optional shield icon near report form; (3) Replace hero image with illustration or icon set; (4) Add icons to scam categories and present them as visual cards (e.g. on home and category landing pages).

---

## 4. Mobile & accessibility

| Item | Status | Notes |
|------|--------|--------|
| **Mobile-first layout** | **Unverified** | Layout uses grids and responsive classes; not confirmed if the "2-column link grid" breaks on small screens or if all key areas are single-column on mobile. |
| **Large touch targets (48px+ height)** | **Unverified** | No audit in codebase; buttons/links may be below 48px. |
| **Country auto-detection** | **Missing** | No use of `navigator.language` or IP geolocation to **pre-select country** on the report form. Country is a required dropdown with no default from locale/geo. |

**To implement:** (1) Audit breakpoints and ensure main content is single-column with large tap areas on small screens; (2) Add country pre-select: e.g. map `navigator.language` to a default country and/or call a geolocation API (with consent) and set the country dropdown default.

---

## 5. Navigation & flow

| Item | Status | Notes |
|------|--------|--------|
| **Sticky "Need help now?" CTA** | **Missing** | There is a **floating "Report a scam"** FAB (`FabReport`), not a **"Need help now?"** CTA linking to **emergency contacts** (e.g. bank fraud hotlines, crisis links). |
| **Breadcrumb trail** | **Partial** | Some pages have a **back** nav (e.g. "Home / Report a scam / Report"). No full path like **Home → US → Phishing** on inner scam pages. |
| **Progress indication ("what happens next")** | **Done** | **Report → Track → Prevent** block shown on every scam type page (`/us/scams/[slug]/`) and on category pages (financial-banking, online-phone-scams, government-impersonation-tax, corruption-fraud-waste) via `ProgressSteps` component. |

**To implement:** (1) Add a second FAB or replace FAB with a menu: "Report a scam" + "Need help now?" (link to a page with emergency hotlines/links). (2) Add structured breadcrumbs (e.g. Home → US → [Category] → [Scam type]) on scam and category pages. (3) ~~Add a "What happens next" block (e.g. Report → Track → Prevent) on confirmation or scam type pages.~~ **Done** — see ProgressSteps component.

---

## 6. Content enhancements

| Item | Status | Notes |
|------|--------|--------|
| **Scam prevalence badges** | **Missing** | No **"Most reported"** or **"Trending"** tags on scam types. Data has one textual mention (e.g. "most reported" in copy) but no UI badges or dynamic tags. |
| **Estimated time to report** | **Done** | Shown next to reporting links on scam guides when `estimatedTime` is set in data (e.g. "~5 min", "~10 min"). |

**To implement:** (1) Define a source for "most reported" / "trending" (e.g. from admin stats or manual list) and render badges on cards/links.

---

## Summary table

| Category | Feature | Status |
|----------|---------|--------|
| Search | Prominent "What happened to you?" search bar | Missing |
| Search | Replace category dropdown with search | Missing |
| Wizard | Step-by-step questionnaire | Missing |
| Wizard | Route to right reporting channel via questions | Partial |
| Visual | Warmer tone + empathetic copy | Missing |
| Visual | Trust indicators ("100% free", shield) | Partial |
| Visual | Hero: illustration/icon-driven (no stock photo) | Missing |
| Visual | Card-based scam categories with icons | Partial |
| Mobile | Mobile-first / 48px touch targets | Unverified |
| Mobile | Country auto-detection | Done |
| Mobile | Multi-country support (UK, AU, CA, India, EU + localized authorities) | Missing |
| Nav | "Need help now?" sticky CTA | Done |
| Nav | Full breadcrumb (Home → US → Phishing) | Partial |
| Nav | Progress: Report → Track → Prevent | Done |
| Content | "Most reported" / "Trending" badges | Missing |
| Content | **Estimated time to report (~5 min)** | **Done** — shown next to reporting links on scam guides when `estimatedTime` is set in data. |

---

## From newfeatures2.md (consolidated into FeatureList.md)

| # | Feature from newfeatures2 | Status | Notes |
|---|----------------------------|--------|-------|
| 1 | **Unified Search/Checker** — "Paste anything suspicious" (URLs, phones, emails, crypto, IBAN) | Missing | #1 in FeatureList; high impact / main traffic driver. |
| 2 | **Multi-Country Support** — IP + country selector (UK, AU, CA, India, EU), localized reporting authorities | Missing | #3b in FeatureList; key differentiator. |
| 3 | **Community Scam Reports Feed** — Reddit-style feed, recent scams, upvotes, warnings | Partial | #11 in FeatureList; submit & list exist; no upvotes/feed UX yet. |
| 4 | **Guided "I Got Scammed" Wizard** — What happened? → What did you lose? → Here's what to do | Missing | #4 in FeatureList. |
| 5 | **Trust Score / Risk Rating** — 0–100 score for sites/phones (domain age, SSL, WHOIS) | Missing | #23/#23b in FeatureList; algorithmic score not built. |
| 6 | **Real-Time Scam Alerts & Newsletter** — Trending ticker, email alerts by region | Missing | #15b in FeatureList. |
| 7 | **Dark Mode & Mobile UX** — Dark mode, tighter mobile nav, custom hero illustration | Missing | #19, #21b in FeatureList. |
| 8 | **SEO & Monetization Foundations** — JSON-LD per scam page, ad zones, Claim Your Business | Partial | #17b in FeatureList; some JSON-LD exists. |
| 9 | **Emotional Support Resources** — Mental health hotlines, scam victim support groups | Missing | #27c in FeatureList. |
| 10 | **Browser Extension / API** — Chrome extension warns on suspicious sites; API for data | Planned | #25, #27b in FeatureList. |

---

## From newfeature3.md (ranked by impact; consolidated into FeatureList.md)

| # | Feature from newfeature3 | Why it works | FeatureList ID | Status |
|---|---------------------------|--------------|-----------------|--------|
| 1 | **Scam Alert Subscription** — users follow specific scam types (romance, crypto), get email/push alerts | Recurring engagement + email list for monetization | #15c | Missing |
| 2 | **"Did This Help?" Voting** — upvote/downvote on reports | Social proof + content ranking for SEO | #11b | Done — Yes/No voting on report detail page; one vote per user per report (auth); GET/POST /reports/{id}/helpful |
| 3 | **Scam Heatmap** — visual map showing scam density by region | Viral shareable content; great for press coverage | #13b | Missing |
| 4 | **Verified Recovery Stories** — users post outcomes ("I got $500 back via chargeback") | Hope-driven engagement; unique differentiator | #11c | Missing |
| 5 | **Browser Extension** — warns users before visiting flagged URLs | Persistent daily engagement + trust score distribution | #27b | Planned |
| 6 | **Scam Similarity Matching** — "X other users reported this same number/URL" | Validates victims' experiences; encourages more reports | #1b | Missing |
| 7 | **Monthly Scam Trends Report** — auto-generated newsletter/blog post from aggregated data | SEO content machine + newsletter growth | #16b | Missing |
| 8 | **Reward / Gamification** — badges for reporting ("Scam Hunter", "Community Guardian") | Incentivizes repeat contributions | #11d | Missing |

---

*Generated from readme_New_UX.md, newfeatures2.md, and newfeature3.md. Update this list as features are implemented.*
