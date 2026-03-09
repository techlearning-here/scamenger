# Scam Avenger – Team Roles and Responsibilities

This document defines roles and responsibilities for running and growing the Scam Avenger website. Use it to onboard team members, assign tasks, and ensure clear ownership.

---

## Table of contents

1. [Technical](#1-technical)
2. [Admin (content moderation & operations)](#2-admin-content-moderation--operations)
3. [Social media & marketing](#3-social-media--marketing)
4. [Content & editorial](#4-content--editorial)
5. [Support & community](#5-support--community)
6. [Analytics & growth](#6-analytics--growth)
7. [Legal, compliance & trust](#7-legal-compliance--trust)
8. [Quick reference](#8-quick-reference)

---

## 1. Technical

**Purpose:** Keep the site running, secure, and improving.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Deployment & infrastructure** | Deploy and maintain frontend (Vercel), backend (Render), and database (Supabase). Run migrations (`001_schema.sql`, `002_contact_messages.sql`) in each environment. Ensure env vars are set correctly (see [DEPLOYMENT.md](./DEPLOYMENT.md)). | Tech lead / DevOps |
| **Monitoring & uptime** | Check health endpoints (`/health` on frontend and backend). Set up alerts for downtime or errors. Monitor Render spin-down on free tier and response times. | Tech / DevOps |
| **Security** | Keep dependencies updated. Protect admin routes (`/z7k2m9/*`), service keys, and PII. Review rate limiting (contact and reports) and CORS if needed. | Tech lead |
| **Development & features** | Implement new features (e.g. search, public report list, email on approval). Write tests (TDD where applicable). Fix bugs and improve performance. | Developers |
| **Data & backups** | Understand Supabase backup and point-in-time recovery. Plan for data export (reports, contact messages) if required for compliance or migration. | Tech / DevOps |
| **Documentation** | Keep DEPLOYMENT.md, API docs, and this document accurate when infrastructure or flows change. | Tech lead |

### Key technical details

- **Stack:** Next.js (frontend), FastAPI (backend), Supabase (DB). Hosting: Vercel, Render.
- **Admin area:** `/z7k2m9/` — login, reports list, approve/reject, messages. Credentials and tokens must stay confidential.
- **Public API:** `POST /contact`, `POST /reports`, `GET /reports/{id}`. Rate limits apply; 429 responses include `Retry-After`.

---

## 2. Admin (content moderation & operations)

**Purpose:** Review user-generated content and operate the admin dashboard so the site stays trustworthy and useful.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Report moderation** | Log in at `/z7k2m9/`, open **View reports**. Review new reports (pending). Approve clear, legitimate scam reports; reject spam, duplicates, or inappropriate content. Use **View full report** and **View as public** to verify before approving. | Admin / moderator |
| **Report actions** | Use **Approve**, **Reject**, **Edit** (e.g. fix category or narrative), and **Delete** when necessary. Rejected reports return 404 to the public; deleted reports are removed from the database. | Admin / moderator |
| **Contact messages** | Open **View messages** (`/z7k2m9/messages/`). Read new messages, reply externally (e.g. email), mark as read, delete when handled or spam. Respond within the agreed SLA (e.g. 48–72 hours). | Admin / support |
| **Dashboard hygiene** | Don’t share admin URL or credentials. Log out when done. If credentials are compromised, rotate password and tokens immediately. | All admins |
| **SLA & escalation** | Define and meet SLAs for report review (e.g. within 48 hours) and contact replies. Escalate legal, abuse, or security issues to Technical and Legal. | Admin lead |

### Key admin details

- **Login:** `POST /z7k2m9/login` with username/password; use returned token for all other admin requests.
- **Reports:** Paginated list with filters; each report can be approved, rejected, patched, or deleted.
- **Messages:** List with read/unread; open a message to load body and mark read; delete when no longer needed.

---

## 3. Social media & marketing

**Purpose:** Grow awareness, traffic, and trust through owned and paid channels.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Channel management** | Maintain and update official profiles (Facebook, YouTube, X/Twitter, LinkedIn, Telegram). Keep links and bios consistent with the site (e.g. “Report scams – Scam Avenger”). Set env vars for footer links (e.g. `NEXT_PUBLIC_FACEBOOK_URL`) when deploying. | Social / marketing |
| **Content calendar** | Plan posts around scam awareness, new features, success stories, and official reporting links (FTC, IC3, CFPB). Balance education and engagement without encouraging panic. | Social / content |
| **Campaigns** | Run campaigns (organic and paid) to drive report submissions, contact signups, or newsletter signups when available. Track UTM parameters and referrers. | Marketing |
| **Community engagement** | Reply to comments and DMs in line with brand voice. Don’t give legal or financial advice; point to official resources and the site’s Report and Contact flows. | Social |
| **Crisis & reputation** | If the brand or site is mentioned in a scam or controversy, coordinate with Legal and Technical. Prepare short holding statements and link to official reporting channels. | Marketing lead |

### Key marketing details

- **Footer social links:** Configured via `NEXT_PUBLIC_*_URL` (e.g. `NEXT_PUBLIC_FACEBOOK_URL`). See frontend `.env.example` and [DEPLOYMENT.md](./DEPLOYMENT.md).
- **Tagline:** “One scam report can protect millions of people. We’ll newly connect you to the right help.” Use consistently in bios and ads.
- **Site URLs:** Use canonical URLs (e.g. `PUBLIC_SITE_URL`) in sitemap, ads, and social links.

---

## 4. Content & editorial

**Purpose:** Keep on-site content accurate, helpful, and aligned with the mission.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Scam types & categories** | Keep scam type pages (e.g. under `/us/scams/`) and category copy up to date. Add new scam types when patterns emerge; link to official reporting where relevant. | Content / editorial |
| **News & alerts** | Update the News section with consumer protection and scam alerts from trusted sources (FTC, CISA, etc.). Ensure dates and links are correct. | Content / editorial |
| **About & policy pages** | Maintain About, Contact, and any privacy/terms pages. Reflect current practices (e.g. how reports and contact messages are used and stored). | Content / legal |
| **SEO & discoverability** | Use metadata, headings, and canonicals consistently. Align with [DEPLOYMENT.md](./DEPLOYMENT.md) and sitemap configuration. | Content / marketing |

### Key content details

- **Scam data:** Static and/or CMS-driven content under `frontend` (e.g. scam slugs, categories). Coordinate with Technical for new pages or schema changes.
- **Contact form:** Public submits at `/contact`; content team may define auto-reply or FAQ text used in support replies.

---

## 5. Support & community

**Purpose:** Help users and partners use the site and report scams safely.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Contact form triage** | Triage incoming contact messages (see Admin: View messages). Reply to questions, feedback, and partnership inquiries; forward abuse or legal issues. | Support / admin |
| **Report submitter support** | If submitters ask about status: reports are pending until approved; they can use their shareable link and view token. Don’t disclose internal review details. | Support |
| **Partnerships** | Handle requests from organizations (e.g. link exchanges, data sharing). Coordinate with Legal and Technical before committing. | Community / marketing |
| **Documentation** | Maintain a short FAQ or help section (if present) so users understand report flow, contact, and what “approval” means. | Support / content |

### Key support details

- **Contact:** Stored in `contact_messages`; required fields: name, email, message. Rate limited (e.g. 5/minute per IP).
- **Reports:** Submitter gets a shareable link and optional view token; narrative is masked publicly until approval.

---

## 6. Analytics & growth

**Purpose:** Measure performance and inform product and marketing decisions.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Traffic & engagement** | Use analytics (e.g. Vercel Analytics, Google Analytics, or similar) to track visits, report submissions, contact submissions, and key pages. Respect privacy and consent (e.g. cookie banners if required). | Analytics / marketing |
| **Funnels** | Define and monitor funnels: landing → report form → submission; landing → contact; social → site. Identify drop-off and opportunities. | Growth / marketing |
| **Reporting** | Produce regular reports (e.g. weekly/monthly) on submissions, approvals, contact volume, and top traffic sources. Share with Admin, Marketing, and Leadership. | Analytics |
| **Experimentation** | Propose and run A/B tests or copy changes (e.g. tagline, CTA) with Technical support. Document results. | Growth |

### Key analytics details

- **AdSense (optional):** If used, configure `NEXT_PUBLIC_ADSENSE_*` in Vercel; see [DEPLOYMENT.md](./DEPLOYMENT.md). Track placement performance.
- **UTM and referrers:** Use consistent UTM parameters for campaigns so social and marketing can attribute traffic.

---

## 7. Legal, compliance & trust

**Purpose:** Keep the project compliant and trustworthy.

### Roles and responsibilities

| Responsibility | Details | Owner |
|----------------|--------|--------|
| **Privacy** | Ensure privacy notice reflects how reports, contact messages, and analytics data are collected, used, and retained. Align with Supabase and third-party (e.g. Vercel, Render) data handling. | Legal / compliance |
| **Terms of use** | Define what users can and cannot do (e.g. no false reports, no abuse of contact form). Enforce via moderation (Admin) and rate limiting (Technical). | Legal |
| **Data handling** | Define retention for reports and contact messages; implement deletion or anonymization where required. Support data subject requests if applicable. | Legal / Technical |
| **Trust & safety** | Escalate serious abuse, legal threats, or law-enforcement requests to Legal and Technical. Don’t promise outcomes; document requests and actions. | Admin lead / Legal |

### Key compliance details

- **PII:** Reports and contact messages may contain PII; store only what’s necessary and protect admin access.
- **Official reporting:** Site directs users to FTC, IC3, CFPB, etc.; don’t imply that Scam Avenger replaces official reporting.

---

## 8. Quick reference

| Role / function   | Main focus | Key tools / URLs |
|-------------------|------------|-------------------|
| **Technical**     | Deploy, monitor, secure, build | Vercel, Render, Supabase, GitHub, [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **Admin**         | Moderate reports, handle messages | `/z7k2m9/`, `/z7k2m9/messages/` |
| **Social / marketing** | Channels, campaigns, brand | Footer social links, env vars, UTM |
| **Content**       | Scam types, news, About, SEO | CMS/static content, metadata |
| **Support**       | Contact triage, user help | Admin View messages, FAQ |
| **Analytics**     | Traffic, funnels, reporting | Analytics tooling, AdSense (if used) |
| **Legal / trust** | Privacy, terms, data handling | Policies, escalation path |

---

*Document owner: project lead. Update this file when roles, URLs, or processes change. Last updated: 2025.*
