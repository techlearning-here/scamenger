# Scam Avenger — Feature List

Consolidated feature list from NewFeatures.md, readme_New_UX.md (UX/design), **newfeatures2.md**, **newfeature3.md**, and **post_scam_recovery.md**. **Status** reflects current implementation: **Done** = implemented, **Partial** = partly there, **Missing** = not built, **Unverified** = not audited, **Planned** = backlog.

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
| 1 | **Unified scam checker** | "Paste anything suspicious" — single search bar for URLs, phone numbers, emails, crypto wallets, or IBAN. **High impact:** main traffic driver we lack. | Missing |
| 2 | **Search-first approach** | Prominent search bar: "What happened to you?" — natural-language input so users describe their scam instead of browsing categories. Reduces stress for victims who don't know category names. | Missing |
| 2b | **Replace category dropdown with search** | Report form uses search/natural language to suggest categories or reporting channels instead of (or in addition to) Scam category + Report type dropdowns. | Missing |
| 3 | **Country auto-detection** | Use `navigator.language` or IP geolocation to pre-select country and reduce friction. | Done |
| 3b | **Multi-country support** | Country selector and localized reporting authorities for UK, AU, CA, India, EU (plus DE, FR, and others). Need help now? and Report form offer country dropdown with locale detection; emotional support and help links are localized per country. | Done |

---

## 2. Guided Experience & Reporting

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 4 | **Wizard / guided flow** | Step-by-step interactive flow: "What happened? → What did you lose? → Here's exactly what to do." More empathetic than static guides; routes users to the right reporting channel. Reduces cognitive load. *Unique differentiator.* | Missing |
| 4b | **Route to right reporting channel via questions** | Wizard or flow that asks questions and then recommends a specific scam guide or reporting link (e.g. FTC, IC3). Scam type pages already list links; no question-based routing yet. | Partial |
| 5 | **Progress indication** | After selecting a scam type, show clear "what happens next": Report → Track → Prevent. | Done |
| 6 | **Estimated time to report** | Add labels like "~5 min" next to reporting links to set expectations. | Done |

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
| 11 | **Community scam reports feed** | User-submitted reports in a **Reddit-style feed**: recent scams, upvotes, warnings. Browse and submit; builds SEO content organically. | Partial |
| 12 | **Report scams form** | "Seen something suspicious? Share to protect!" — form to submit scam details: **country of scam origin** (required), report type (website, phone, crypto address, or IBAN; "+ Add more" for multiple), scam category + subcategory dropdowns, "Lost money?" option, free-text narrative ("How did you get in contact? What happened next?"), and optional consent to share the report with police and crime-fighting agencies. Feeds into the community reports feed (#11). | Done |
| 13 | **Live stats dashboard** | Public metrics (e.g. "X reports, Y scam types, Z visits") to build authority. | Partial |
| 14 | **Press / review badges** | Press logos (e.g. Time, Yahoo Finance) and links to Trustpilot, SiteJabber, Google Reviews for credibility. | Planned |
| 15 | **Newsletter signup** | Email list for recurring traffic and monetizable audience. | Planned |
| 15b | **Real-time scam alerts & newsletter** | Trending scams ticker on site; email alerts for new scam types in user's region. Drives recurring traffic. | Missing |
| 15c | **Scam alert subscription** | Users **follow specific scam types** (e.g. romance, crypto) and get **email/push alerts** when new reports or trends match. Recurring engagement + email list for monetization. *From newfeature3.* | Missing |
| 11b | **"Did this help?" voting** | Upvote/downvote on reports or guides. Social proof + content ranking for SEO. Complements ratings (#P0). *From newfeature3.* | Done |
| 13b | **Scam heatmap** | **Visual map** showing scam density by region. Viral shareable content; strong for press coverage. *From newfeature3.* | Missing |
| 11c | **Verified recovery stories** | Users post **outcomes** (e.g. "I got $500 back via chargeback"). Hope-driven engagement; unique differentiator. *From newfeature3.* | Missing |
| 1b | **Scam similarity matching** | When viewing a URL/number: "**X other users reported this same number/URL**." Validates victims' experiences; encourages more reports. *From newfeature3.* | Done |
| 16b | **Monthly scam trends report** | **Auto-generated** newsletter or blog post from aggregated data. SEO content machine + newsletter growth. *From newfeature3.* | Missing |
| 11d | **Reward / gamification** | Badges for reporting (e.g. "Scam Hunter", "Community Guardian"). Incentivizes repeat contributions. *From newfeature3.* | Missing |

---

## 10. Post-scam recovery & victim journey

*From **docs/post_scam_recovery.md**: roadmap for the post-scam experience (immediate response → recovery → awareness).*

### 10a. Immediate response (0–24 hours post-scam)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 28 | **Emergency Action Checklist** | Auto-generated, scam-type-specific steps (freeze cards, change passwords, enable 2FA) with tap-to-complete tracking. | Missing |
| 29 | **One-Click Bank Alert Generator** | Pre-filled dispute letter/email templates for major banks, customized by scam type and amount. | Missing |
| 30 | **Evidence Collection Wizard** | Guided tool to screenshot, save URLs, export call logs, and package everything into a downloadable "evidence kit". | Missing |
| 31 | **Instant Authority Router** | Based on scam type + location, auto-identify the correct agencies (FTC, IC3, Action Fraud, ACCC) with direct filing links. | Partial (help-now links by country exist; no auto-route by type) |

### 10b. Recovery phase (1–30 days)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 32 | **Recovery Timeline Tracker** | Visual dashboard showing where your case stands (reported → acknowledged → investigating → resolved) across all agencies. | Missing |
| 33 | **Credit Monitoring Alerts** | Integration with free credit monitoring services; AI flags suspicious new accounts. | Missing |
| 34 | **Identity Restoration Checklist** | Step-by-step guide for identity theft victims (credit freezes, IRS PIN, SSA alerts) with progress tracking. | Missing |
| 35 | **Legal Options Advisor** | AI assessment of whether small claims court, class action, or chargeback is the best recovery path based on amount/type. | Missing |

### 10c. Awareness & prevention (ongoing)

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 36 | **Scam Immunity Score** | Gamified quiz system that tests users on recognizing scams, building awareness over time. | Missing |
| 37 | **Personalized Scam Alerts** | Based on demographic, location, and past reports, AI pushes relevant emerging scam warnings. | Missing |
| 38 | **Family Protection Dashboard** | Add elderly parents or teens; get alerts when scams targeting their demographic surge in their area. | Missing |
| 39 | **Recovery Story Publishing** | Verified, anonymized success stories ("I got $2,400 back from PayPal dispute") to give hope and teach tactics. Overlaps with #11c Verified recovery stories. | Missing |

### 10d. Community & advocacy

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 40 | **Victim Support Forum** | Moderated, anonymous peer support grouped by scam type. | Missing |
| 41 | **Scam Impact Calculator** | Quantify total financial + emotional + time cost; aggregate data for advocacy reports. | Missing |
| 42 | **"Warn Others" One-Click** | After reporting, instantly push anonymized alert to social media + Scamenger community feed. Overlaps with #27 (Facebook) and X share; extends to one-click multi-channel. | Partial (admin can post to FB/X; no user one-click "Warn others" flow) |
| 43 | **Monthly Recovery Report** | Auto-generated PDF showing all actions taken, agencies contacted, and recovery status — useful for insurance/tax claims. | Missing |

**Highest impact first (from roadmap):** Start with **Emergency Action Checklist (#28)** + **Evidence Collection Wizard (#30)** + **Authority Router (#31)** — these solve the most urgent pain: "I just got scammed, what do I do RIGHT NOW?"

---

## 9. Social sharing integrations

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 27 | **Facebook — Post approved reports** | When a report submitter gives **consent to share on social** (separate from "share with authorities") and an admin **approves** the report, post an **anonymized summary** (e.g. scam type, country, link to report) to the Scam Avenger Facebook Page via Meta Graph API. No per-post fee from Meta; requires Meta App, Facebook Page, and Page access token. Sub-features: (1) Add `consent_share_social` to report form and DB; (2) Backend job or webhook on approval to build summary and call Graph API `POST /{page-id}/feed`; (3) Optional admin toggle per report "Post to Facebook" at approval time. | Partial (3 done: admin can post from Share modal when FACEBOOK_PAGE_ID + token set) |
| 27d | **Threads (Meta) — Post approved reports** | Post anonymized scam report summaries to the Scam Avenger **Threads** account when an admin approves a report (with user consent to share on social). Same flow as Facebook (#27): admin chooses "Post to Threads" from the share modal; backend builds summary and publishes via Meta's Threads API (or applicable API). Extends "Warn others" reach to Threads. | Missing |

---

## 5. Content & SEO

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 16 | **Scam alerts blog** | Trending scam articles (e.g. Amazon, Coinbase, crypto) as SEO traffic driver and ad revenue. | Partial |
| 17 | **Global country guide** | Per-country pages for long-tail SEO. | Partial |
| 17b | **SEO & monetization foundations** | JSON-LD structured data for each scam type page; defined ad placement zones for future revenue; "Claim Your Business" portal (B2B). | Partial |
| 17c | **Submit to other search engines** | Register site and submit sitemap in **Bing Webmaster Tools** and **Yandex Webmaster** so the site is discoverable on Bing, DuckDuckGo, and Yandex. Use same sitemap URL: `https://scamenger.com/sitemap.xml`. Verify ownership via DNS (TXT) or HTML file/meta tag per provider. | Planned |
| 17d | **Tools & online services** | Nav item **Tools** and page listing official tools and services by country: **Protect & avoid** (scam alerts, awareness), **Recover** (report fraud, complaint portals), **Identity & credit** (free credit report, freeze, identity theft recovery). Supports all major countries (US, UK, CA, AU, IN, EU, DE, FR, NG, PH, ZA). No dependency on Scamenger report DB. | Done |
| 17e | **Tools page — Filter by tag** | Filter tools by tag (Prevent, Free, For victims, Report, Third party, Important). Pills or checkboxes above the list; only tools matching selected tags show. When none selected, show all. | Done |
| 17f | **Tools page — Jump links** | In-page links at top: "Jump to: Identity & credit · Protect & avoid scams · Recover" for quick navigation. | Done |
| 17g | **Tools page — Print** | "Print this page" button to print or save as PDF for offline use (e.g. take to bank or support worker). | Done |
| 17h | **Tools page — External link indicator** | Visual indicator (icon or "opens in new tab") on external tool links so users know they leave the site. | Done |
| 17i | **Tools page — Tool count** | Line under lead or country: "X tools for [Country]" (or "Y official, Z third-party") to set expectations. | Done |

---

## 6. Visual & Emotional Design

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 18 | **Warmer, reassuring tone** | Calming colors (teal/green), empathetic copy ("You're not alone — let's fix this"), trust indicators (shield icons, "100% free, no data collected"). | Missing |
| 18b | **Trust indicators** | Visible "100% free, no data collected" or shield-style trust badges on report flow or hero. | Partial |
| 19 | **Hero section redesign** | Replace generic stock photo with **custom illustration or icon-driven hero**: "report → get help → stay safe." More branded than generic imagery. | Missing |
| 20 | **Sticky "Need help now?" CTA** | Floating button to emergency contacts (e.g. bank fraud hotlines) for users in active crisis. | Done |
| 21 | **Breadcrumb trail** | Inner pages show path (Home → US → Phishing) for easy backtracking. | Partial |
| 21b | **Dark mode & mobile UX** | Dark mode (not currently available). Tighter mobile nav; ensure hero and key flows work well on small screens. | Missing |

---

## 7a. Emotional Support & Resources

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 27c | **Emotional support resources** | Links to **mental health hotlines** and **scam victim support groups**. Human touch competitors often lack; helps users in distress. | Done |

---

## 7. Mobile & Accessibility

| # | Feature | Description | Status |
|---|---------|-------------|--------|
| 22 | **Mobile-first layout** | Single-column stack with large touch targets (48px+ height); fix 2-column grid break on small screens. | Unverified |
| 22b | **Large touch targets (48px+)** | Audit and ensure buttons/links meet 48px+ height for touch. | Unverified |
| 23 | **Trust score / risk rating** | Score websites or phone numbers with a **visual trust meter** (e.g. 0–100). Even a basic heuristic (domain age, SSL, WHOIS) adds huge value. | Partial |
| 23b | **Trust score (algorithmic)** | Full trust/risk score for URLs and phone numbers; surface in unified checker and reports. | Missing |

---

## 8. Revenue-Enabling Features

| # | Feature | Revenue model | Status |
|---|---------|----------------|--------|
| 24 | **Claim your business** | Businesses pay to verify or manage their listing (B2B; e.g. claim-your-business portals). | Planned |
| 25 | **Data services / API** | Sell scam data to ad networks, law enforcement, brands. Public or partner API for lookups. | Planned |
| 26 | **Mobile app** | App installs for push notifications and higher engagement. | Planned |
| 27b | **Browser extension** | Chrome (or other) extension that **warns users on suspicious sites** — huge growth channel. May consume API (#25). | Planned |

---

## Data-dependent vs now: what to build first

**Current situation:** We do not yet have a large database of scams/fraud (user reports). Features that rely on that data will be low-value until the database grows. **Defer data-dependent features to a later stage** and focus on features that work without report volume.

### Defer until DB has grown (later stage)

| # | Feature | Why data-dependent |
|---|---------|--------------------|
| 1 | **Unified scam checker** | Lookup URLs/phones/crypto/IBAN against reported data; needs volume to be useful. |
| 1b | **Scam similarity matching** | Already built; gets more valuable with more reports. No new work needed; value grows with data. |
| P0 | **Aggregated public trends** | Needs enough reports to show meaningful trends (types, regions, over time). |
| 13 | **Live stats dashboard** | "X reports, Y scam types" only compelling with real volume. |
| 13b | **Scam heatmap** | Geographic density requires many reports with location. |
| 23 / 23b | **Trust score / risk rating** | Algorithmic scoring benefits from more URLs/numbers in DB. |
| 16b | **Monthly scam trends report** | Auto-generated from aggregate data. |
| 15b / 15c | **Real-time scam alerts, Scam alert subscription** | Need trend/report data to alert on. |
| 11c | **Verified recovery stories** | User-generated; need volume and submissions. |
| 11d | **Gamification / badges for reporting** | More meaningful when report volume is higher. |
| 41 | **Scam Impact Calculator** | Aggregate financial/emotional cost; needs data. |
| 32 | **Recovery Timeline Tracker** | Per-user case tracking; can defer. |
| 37 / 38 | **Personalized / Family Protection alerts** | Depend on trend and report data. |

### Focus now (no or minimal reliance on report DB)

| # | Feature | Why OK now |
|---|---------|------------|
| 4 | **Wizard / guided flow** | "What happened? → Here’s what to do." Uses existing guides and help-now links; no lookup DB. |
| 4b | **Route to right reporting channel via questions** | Question flow → recommend existing scam guides and official links. |
| 2 / 2b | **Search-first, Replace dropdown with search** | Search over existing static content (guides, categories); suggest categories from current site. |
| 7 | **Card-based scam categories** | UX improvement; content already exists. |
| 28 | **Emergency Action Checklist** | Scam-type-specific steps (freeze cards, 2FA, etc.); static or from existing guide data. |
| 30 | **Evidence Collection Wizard** | Guided UI to collect screenshots, URLs, call logs → evidence kit; no DB lookup. |
| 31 | **Instant Authority Router** | Map scam type + country → FTC, IC3, Action Fraud, etc.; use existing help-now/country data. |
| 29 | **One-Click Bank Alert Generator** | Pre-filled dispute templates; static content per bank. |
| 34 | **Identity Restoration Checklist** | Step-by-step static guide for identity theft. |
| 16 | **Scam alerts blog** | Content; SEO and traffic. |
| 17 | **Global country guide** | Per-country content pages. |
| 15 | **Newsletter signup** | Collect emails; no report data needed. |
| 18 / 19 | **Warmer tone, Hero redesign** | Design and copy. |
| 21 / 21b | **Breadcrumbs, Dark mode & mobile UX** | UX and accessibility. |
| 22 / 22b | **Mobile-first, 48px touch targets** | Audit and fix; no data. |
| 17c | **Submit to other search engines** | Bing, Yandex; already planned. |
| 17d | **Tools & online services** | Nav “Tools” + page with official tools by country (protect, recover, identity). Done. |
| 9 | **Niche scam tools** (e.g. Romance Scam Checker) | Can start as educational content / flow; no lookup required. |
| 14 | **Press / review badges** | Static links and logos. |
| 27 / 27d | **Facebook, Threads — post approved reports** | Already partial; admin posts; not dependent on DB size. |

Use the list above to pick the next feature to implement; revisit data-dependent items once report volume is meaningful.

---

## Recommended priority (from NewFeatures.md)

| Phase | Focus |
|-------|--------|
| **Top priority** | **Report scams platform (P0)** — Shareable report URLs (submit without signing in), authenticated view + ratings (fraud mitigation), aggregated public trends (no specifics). Stack: Supabase + backend (Render) + frontend (Next.js on Vercel). |
| **Phase 1 (MVP)** | Unified scam checker (#1) + Report scams form (#12) + Community reports (#11) + Scam category cards (#7/#8) + Country guide (#17) |
| **Phase 2** | Blog/alerts (#16) + Live stats (#13) + Newsletter (#15) + **Facebook — post approved reports (#27)** |
| **Phase 3** | B2B "Claim your site" (#24) + API (#25) + Mobile app (#26) |

**Differentiator:** The "I got scammed → what do I do now?" guided wizard (#4) remains a unique angle in the space. **Post-scam recovery** (Section 10): highest-impact first = Emergency Action Checklist (#28) + Evidence Collection Wizard (#30) + Authority Router (#31).

---

## Status summary (from MISSING_FEATURES_FROM_NEW_UX.md + newfeatures2.md)

| Status | Count | Examples |
|--------|-------|----------|
| Done | 13 | P0 report + shareable URL, auth ratings, Stack, Report form (#12), Scam category education (#8), "Need help now?" CTA (#20), Country auto-detection (#3), Estimated time (#6), **Emotional support (#27c)**, **Progress indication (#5)**, **"Did this help?" voting (#11b)**, **Scam similarity matching (#1b)**, **Multi-country support (#3b)** |
| Partial | 12+ | Aggregated trends, Card-based categories (#7), Route to channel (#4b), Trust indicators (#18b), Breadcrumb (#21), Community reports (#11), Live stats (#13), Blog (#16), Country guide (#17), Trust score (#23), SEO/monetization (#17b) |
| Missing | 16+ | Unified scam checker (#1), Search-first (#2), Replace dropdown (#2b), Wizard (#4), Prevalence badges (#10), Warmer tone (#18), Hero redesign (#19), Dark mode & mobile UX (#21b), Real-time alerts (#15b), Trust score algorithmic (#23b), **Scam alert subscription (#15c)**, **Scam heatmap (#13b)**, **Recovery stories (#11c)**, **Monthly trends report (#16b)**, **Gamification (#11d)** — plus **post-scam recovery (#28–43)**: Emergency Checklist, Bank Alert Generator, Evidence Wizard, Recovery Tracker, Credit Monitoring, Identity Checklist, Legal Advisor, Scam Immunity Score, Personalized Alerts, Family Dashboard, Victim Forum, Impact Calculator, Monthly Recovery Report |
| Unverified | 2 | Mobile-first (#22), 48px touch targets (#22b) |
| Planned | 7+ | Niche tools (#9), Press badges (#14), Newsletter (#15), Facebook post (#27), Revenue (#24–26), Browser extension (#27b) |

*Last updated from NewFeatures.md, readme_New_UX.md, MISSING_FEATURES_FROM_NEW_UX.md, **newfeatures2.md**, **newfeature3.md**, and **post_scam_recovery.md**.*
