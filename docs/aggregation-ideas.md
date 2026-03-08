# Aggregating from external sites

This doc lists what Scam Avenger already aggregates and what else you can add from official and trusted sources.

## Currently aggregated (News page)

- **FTC** – Press releases (consumer protection + general) and **FTC Consumer Blog** (consumer.ftc.gov/blog) for tips and alerts.
- **FBI IC3** – News / PSA feed (ic3.gov/rss/news.xml).
- **CFPB** – Newsroom feed (consumerfinance.gov/about-us/newsroom/feed/) for enforcement, complaints, and financial protection news.

All feeds are merged, deduped, and sorted by date at build time. The News page updates when you rebuild (e.g. via your 2-day cron or on deploy).

---

## More RSS feeds you can add

Same pattern: add a `{ url: '...', sourceName: '...' }` entry to `NEWS_FEEDS` in `frontend/app/news/getNews.ts`.

| Source | RSS URL | Notes |
|--------|---------|--------|
| **FTC Data Spotlight** | Check [FTC RSS Feeds](https://www.ftc.gov/news-events/stay-connected/ftc-rss-feeds) | Data Spotlights and other FTC feeds if listed |
| **FTC Business Blog** | From FTC stay-connected page | Less consumer-focused but sometimes relevant |
| **SEC Investor Alerts** | [sec.gov](https://www.sec.gov) – look for “RSS” or “Feeds” in footer / investor education | Investor fraud, crypto, pump-and-dump |
| **FBI (main)** | [fbi.gov/rss](https://www.fbi.gov/rss.htm) | Broader FBI news; filter or label by topic if needed |
| **OCC (banking)** | If available on occ.gov | Bank fraud, enforcement |
| **State AGs** | Some state attorneys general have RSS (e.g. state consumer alerts) | Add per state if you want state-level alerts |

---

## Non-RSS content you can link or surface

- **FTC Consumer Alerts** – [consumer.ftc.gov/consumer-alerts](https://consumer.ftc.gov/consumer-alerts)  
  No public RSS; you can link from your fallback list or a “Scam alerts” section. Optionally scrape or use a third-party RSS builder (e.g. Feedity) if you want to show headlines.

- **IC3 PSA** – [ic3.gov/PSA](https://www.ic3.gov/PSA)  
  You already use `ic3.gov/rss/news.xml`; the PSA page is the same content in HTML. No extra feed needed unless you find a separate PSA-only RSS.

- **BBB Scam Tracker** – [bbb.org/scamtracker](https://www.bbb.org/ScamTracker)  
  No official public RSS/API. To show “recent reports” you’d need a scraper or paid API; for now, linking from a “Report a scam” or “Check a scam” section is the safest option.

- **State consumer protection / AG offices** – [usa.gov/state-consumer](https://www.usa.gov/state-consumer)  
  Good to link; some states have alert sign-ups or feeds you could add to `NEWS_FEEDS` if they publish RSS.

- **CISA (cyber)** – [cisa.gov/news](https://www.cisa.gov/news)  
  Check for RSS; useful for phishing, ransomware, and cyber scam context.

- **IRS (tax scams)** – [irs.gov/newsroom](https://www.irs.gov/newsroom)  
  Check for RSS; good for tax/refund scam alerts.

---

## Statistics and reports (link or cite)

- **FTC Data** – [ftc.gov/data](https://www.ftc.gov/data)  
  Use for “By the numbers” or a small stats widget; link to the source. No stable JSON API; you’d cite or manually copy key figures into your scam pages (as you already do in `statistics`).

- **IC3 Annual Report** – [ic3.gov/AnnualReport](https://www.ic3.gov/AnnualReport)  
  Same idea: link from your site or pull a few headline numbers into static content at build time.

---

## What to avoid

- **Scraping full article text** from other sites and republishing on your site (copyright and duplicate content).
- **Unofficial or unverified “scam list” APIs** unless they’re clearly from a government or trusted org.
- **User-generated scam reports** from other platforms unless you only link out and don’t republish.

Sticking to **RSS from official agencies**, **linking** to alerts and tools, and **citing** reports and data keeps aggregation safe and useful.
