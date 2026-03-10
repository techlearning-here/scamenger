# SEO Summary

This document summarizes the on-site SEO optimizations applied to improve search visibility for queries like "where to report scam", "report fraud USA", "FTC report", "IC3", etc.

## What Was Done

### 1. **Global (layout)**
- **Title**: Primary keyword first – "Where to Report Scams, Fraud & Corruption | Scam Avenger".
- **Meta description**: ~155 characters, includes FTC, IC3, CFPB, "report scam", "report fraud", "no sign-up".
- **Keywords**: Expanded long-tail (where to report scam/fraud, report scam USA, FTC report fraud, IC3, CFPB complaint, identity theft report, phishing, etc.).
- **JSON-LD**: Added `Service` schema (Scam & Fraud Reporting Guides, areaServed USA) alongside existing `WebSite` and `Organization` for richer results.
- **Open Graph / Twitter**: Title and description aligned with meta; image alt text keyword-aware.

### 2. **Home page**
- **Title**: "Where to Report Scams, Fraud & Corruption | Scam Avenger".
- **H1**: "Where to Report a Scam – Get Official Links (FTC, IC3, CFPB)" with supporting line for relevance and CTR.
- **Meta description**: Keyword-rich, under 160 characters.

### 3. **Sitemap**
- **Lookup-report** and other main pages included.
- **Priorities**: Home 1.0; report/help-now 0.95; lookup-report/news 0.9; about/contact 0.85; scam guides 0.8.
- **lastModified** set for all URLs.
- **changeFrequency**: weekly for most; monthly for about/contact.
- **Removed** from sitemap: `/reports/` (noindex), `/login/`, `/auth/callback/` (not useful to index).

### 4. **Robots**
- **Disallow**: `/z7k2m9/` (admin), `/auth/`, `/login/` so crawlers don’t waste budget on non-public pages.
- **Allow**: `/` for all user agents; explicit rule for Googlebot; sitemap URL declared.

### 5. **Page-level metadata**
- **Report**: "Report a Scam Anonymously | Scam Avenger" + keywords (report a scam, report scam anonymously, submit scam report, etc.).
- **About**: "About Scam Avenger – Where to Report Scams & Fraud" + keyword-rich description.
- **Contact**: "Contact Us | Scam Avenger – Report Scams & Fraud" + description and keywords.
- **Lookup-report**: "Look Up Scam Report by ID | Scam Avenger" + OG/Twitter and keywords.
- **News**: "Scam & Fraud News | FTC, IC3, CFPB Alerts | Scam Avenger" + keywords.
- **Help-now**: "Need Help Now? Report Fraud – FTC, IC3, CFPB Links | Scam Avenger" + keywords.
- **Scam guide pages** (`/us/scams/[slug]/`): Full title "How to Report [Scam Name] in the USA | Scam Avenger" (not just scam name) for better SERP snippets.

## Optional Next Steps (not implemented)

- **Google Search Console**: Add property, submit sitemap, monitor indexing and queries.
- **Verification**: Add `verification.google` and/or `verification.yandex` in layout metadata when you have the codes.
- **Bing Webmaster Tools**: Submit sitemap and verify site.
- **Content**: Add an FAQ section (e.g. "Where do I report a scam?", "Is reporting to the FTC free?") and mark it up with `FAQPage` schema for potential FAQ rich results.
- **Core Web Vitals**: Keep LCP/CLS/INP in check (e.g. next/font, next/image, minimal render-blocking) as in OPTIMIZATIONS.md.
- **Backlinks**: Quality links from official or trusted sites (e.g. .gov, consumer protection orgs) help authority; on-site SEO alone cannot guarantee #1.

## Note on Ranking

Ranking #1 depends on competition, user behavior, and domain authority. These changes improve relevance, crawlability, and snippet quality so the site can compete better for target queries. Use Search Console and analytics to track which queries and pages perform and iterate.
