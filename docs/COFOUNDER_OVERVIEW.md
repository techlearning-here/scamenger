# Scam Avenger — Co-Founder Overview

**For the founding team:** What we're building, how it helps users, growth potential, and revenue path.  
*Based on [FeatureList.md](./FeatureList.md).*

---

## Blue ocean opportunity

This is **Scamenger's blue ocean opportunity** — the **"WebMD of scams"**: *detect what happened → guide you through reporting → help you recover* — all in one free platform.

**Verdict:**  
The market is fragmented. Truecaller owns caller ID, Malwarebytes owns device protection, but **nobody owns the post-scam recovery experience**. That's our lane.

---

## 1. What we're building

**One sentence:**  
Scam Avenger is a **community-driven scam reporting and recovery platform** where people report scams, check if something is suspicious, get step-by-step help (report → recover → prevent), and warn others — with multi-country support and a path from “I got scammed” to “here’s what to do right now.”

**In practice we are building:**

- **Report & share** — Anyone can submit a scam report (no sign-in), get a shareable link, and optionally consent to share anonymized summaries on our social channels after admin approval.
- **Check & validate** — “Did others report this too?” (similarity matching today; full “paste anything suspicious” checker and trust score on the roadmap).
- **Guide & route** — Scam-type education, country-specific “Need help now?” links, time estimates, and (roadmap) a guided wizard and authority router so users land on the right agency (FTC, IC3, Action Fraud, ACCC, etc.).
- **Recover & support** — Emotional support resources and (roadmap) emergency checklists, evidence wizard, recovery timeline, and legal/recovery options.
- **Community & prevention** — “Did this help?” voting, category education, and (roadmap) victim forum, recovery stories, scam alerts, and family protection.

**Tech:** Next.js (Vercel), FastAPI (Render), Supabase. Report flow works without sign-in; ratings and some features use Supabase Auth.

---

## 2. How we help users

### Problems we solve

| Problem | How we help today | How we’ll help (roadmap) |
|--------|-------------------|---------------------------|
| “I’m not sure if this is a scam.” | Shareable reports, “X users reported this” similarity, scam type guides. | Unified checker (paste URL/phone/email/crypto), trust score, prevalence badges. |
| “I got scammed — what do I do right now?” | “Need help now?” CTA, country-specific hotlines, scam-type pages with reporting links and ~time. | Emergency checklist, evidence wizard, one-click bank dispute templates, authority router. |
| “I feel alone and don’t know who to tell.” | Report form (no account), emotional support links, optional share to authorities/social. | Victim support forum, “Warn others” one-click, recovery stories. |
| “I’m in another country — is this relevant?” | Multi-country support, country selector, localized authorities and emotional support. | Deeper localization, family protection dashboard, regional alerts. |
| “I want to protect others.” | Submit report, share link, consent for social; admin can post to Facebook/X. | One-click “Warn others,” community feed, scam heatmap, impact calculator for advocacy. |

### User journey (current → future)

1. **Before they’re sure** — Search/check (roadmap: unified checker) → See if others reported it → Get trust signal.
2. **Right after being scammed** — Land on site (or report) → “Need help now?” + right country → Get agency links and (roadmap) emergency checklist + evidence kit.
3. **Reporting** — Submit report (no sign-in) → Get shareable link → Optional consent for authorities + social.
4. **Recovery** — Use support links today; later: recovery timeline, identity checklist, legal options, monthly recovery PDF.
5. **Ongoing** — Read guides, vote “Did this help?”; later: scam alerts, immunity score, family dashboard.

---

## 3. Features by theme (and user benefit)

### Live now (Done / Partial)

- **Report scams + shareable URL** — Low-friction reporting; shareable link for evidence and warnings.
- **Multi-country support** — Right authorities and support per country (UK, AU, CA, India, EU, etc.).
- **Scam type education** — Clear guides and actions per category (e.g. phishing, romance, crypto).
- **“Need help now?”** — Sticky CTA to hotlines and help; reduces panic.
- **Emotional support resources** — Links to mental health and victim support (differentiator).
- **“Did this help?” voting** — Social proof and better content ranking.
- **Scam similarity** — “X users reported this number/URL” validates and encourages reporting.
- **Progress indication + time estimates** — Sets expectations (e.g. “~5 min” to report).
- **Admin post to Facebook/X** — Anonymized approved reports to our social channels (with consent).
- **Scam category cards, country guide, blog, trust indicators** — Discovery, SEO, and trust.

### Next (high impact)

- **Unified scam checker** — “Paste anything suspicious” (URL, phone, email, crypto, IBAN) → main traffic and habit.
- **Guided wizard** — “What happened? → What did you lose? → Here’s what to do” → unique “I got scammed, what now?” flow.
- **Post-scam immediate response** — Emergency checklist + evidence wizard + authority router (first 0–24 hours).
- **Recovery tools** — Timeline tracker, bank dispute templates, identity checklist, legal options.
- **Community & advocacy** — Victim forum, recovery stories, “Warn others” one-click, monthly recovery report, impact calculator.

### Later (retention + scale)

- Scam alerts & newsletter, scam-type subscriptions, heatmap, gamification (badges).
- Trust score (algorithmic), browser extension, mobile app.
- B2B: Claim your business, data/API for brands and law enforcement.

---

## 4. Growth potential

### Traffic & acquisition

- **Unified checker** — Search-led use case (“is this scam?”) drives repeat and organic search.
- **SEO** — Scam type pages, country guides, blog, reports as content; JSON-LD and structure in place.
- **Viral/share** — Shareable report links, “X users reported this,” (later) heatmap and recovery stories.
- **Social** — Approved reports on Facebook/X; roadmap: one-click “Warn others” and recovery stories.
- **Multi-country** — Same product in many regions → more keywords, more authorities, more word-of-mouth.

### Engagement & retention

- **Newsletter + alerts** — Recurring touchpoints; scam-type or region subscriptions deepen retention.
- **Recovery journey** — Checklists, timeline, PDF report → multiple sessions over days/weeks.
- **Community** — Forum, voting, recovery stories, gamification → reason to return and contribute.
- **Family dashboard** — Protect relatives → ongoing use and sharing.

### Moats

- **Data** — More reports and checks → better similarity and trust signals → more reports (flywheel).
- **Trust** — “100% free, no data sold,” emotional support, and clear guidance vs. pure aggregators.
- **Geography** — Localized authorities and support per country is hard to replicate at scale.

---

## 5. Revenue growth

### Monetization levers (from FeatureList)

| Lever | Description | Status | Potential |
|-------|-------------|--------|-----------|
| **Ads** | Display on high-intent pages (checker, guides, blog). | Foundations (SEO, placement zones) partial. | High — scam/search intent is monetizable; need volume from checker + SEO. |
| **Newsletter / alerts** | Free tier + optional premium or sponsored alerts. | Planned. | Medium — builds audience; sponsorship and partnerships possible. |
| **B2B — Claim your business** | Businesses verify or manage listing (e.g. “we’re not a scam”). | Planned. | Medium — per-business fee; depends on traffic and trust. |
| **Data / API** | Anonymized or aggregated data for brands, platforms, law enforcement. | Planned. | High — recurring B2B; needs clear privacy and compliance. |
| **Browser extension** | Free product, optional premium or partner integration; can use API. | Planned. | High — distribution and daily touchpoint. |
| **Mobile app** | Free app; push alerts, premium or partnerships later. | Planned. | Medium — engagement and retention. |

### Phasing revenue

- **Now** — Focus on product and usage: checker, wizard, post-scam recovery, community. Revenue = $0; goal = traction and trust.
- **Phase 1 (post-MVP)** — Soft monetization: ad zones on checker and guides, newsletter signup, optional sponsorship. Goal: prove CPM and engagement.
- **Phase 2** — Scale traffic (SEO, social, extension), then layer B2B: “Claim your business” and data/API pilots. Goal: mix of ads + B2B.
- **Phase 3** — Extension and app as growth channels; premium or partner tiers where they fit. Goal: diversified revenue (ads, B2B, partnerships).

### What we’re not doing (for trust)

- We do **not** sell user PII or report narratives. Aggregated/anonymized data only for B2B.
- “100% free” for consumers is a core message; any paid features (if any) would be clearly optional (e.g. premium alerts or reports).

---

## 6. Summary for the team

| Pillar | Today | Next 6–12 months | Long term |
|--------|--------|--------------------|-----------|
| **Product** | Report + share, multi-country, education, help now, emotional support, similarity, social posting. | Unified checker, wizard, post-scam emergency + recovery tools, forum/recovery stories. | Alerts, trust score, extension, app, family dashboard. |
| **User value** | “Report and share,” “others reported this,” “get help and support by country.” | “Check anything,” “do this right now,” “track recovery and warn others.” | “Stay protected and help your family.” |
| **Growth** | SEO, social sharing, multi-country. | Checker-led traffic, viral reports and recovery stories. | Extension, app, newsletter, partnerships. |
| **Revenue** | $0. | Test ads + newsletter; maybe first B2B pilots. | Ads + B2B (claim + API) + optional premium/partners. |

**Differentiator:** Combining **report → check → guide → recover → warn** in one place, with multi-country support and a human touch (emotional support, recovery stories). The “I got scammed — what do I do RIGHT NOW?” flow (wizard + emergency checklist + evidence wizard + authority router) is the wedge; community and data create the flywheel.

---

## 7. Verdict

The market is **fragmented**. Truecaller owns caller ID, Malwarebytes owns device protection, but **nobody owns the post-scam recovery experience**. That's our lane. We're building the one place that takes users from *something happened* → *here's what it is* → *here's how to report* → *here's how to recover* — all free, with multi-country support and a community that warns others. That's the WebMD-of-scams position.

---

*Details and full backlog: [FeatureList.md](./FeatureList.md).*
