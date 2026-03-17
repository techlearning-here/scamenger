# SEO & indexing (Google Search Console)

This doc explains common GSC statuses and what to do about them.

---

## “Discovered – currently not indexed” (53 affected pages)

**What it means:** Google has discovered these URLs (e.g. from your sitemap or links) but has **not** yet indexed them. “Last crawled: N/A” usually means either Google hasn’t crawled the URL yet, or it crawled and deferred indexing (e.g. crawl budget or low priority).

**What’s already in place:**

- **Sitemap:** All these URLs are in `/sitemap.xml` (static routes, `/us/scams/[slug]/`, `/stories/[slug]/`).
- **Robots:** `robots.txt` allows `/` and points to `https://scamenger.com/sitemap.xml`.
- **Canonicals:** Each page sets a canonical URL (e.g. `https://scamenger.com/about/`).
- **Internal links:** Homepage, footer, and nav link to report, help-now, immediate-help, about, contact, privacy, terms, and scam guides.

**What you can do:**

1. **Request indexing for priority URLs (GSC)**  
   In [Google Search Console](https://search.google.com/search-console) → **URL Inspection**, enter a URL (e.g. `https://scamenger.com/about/`) and click **Request indexing**. Do this for 10–20 high-value pages (about, contact, immediate-help, lookup-report, help-now, a few key `/us/scams/` pages). Google doesn’t guarantee indexing, but it can speed up recrawl.

2. **Give it time**  
   New or low-authority sites often have a backlog. As crawl budget and authority grow, more “Discovered” URLs get crawled and indexed.

3. **HTML sitemap**  
   The site has an HTML sitemap at `/site-map/` that links to all main sections. It gives crawlers one more path to discover and prioritize URLs.

4. **Keep content and links**  
   Ensure each page has a unique title and description (already done). Strong internal links from the homepage and key hubs (e.g. help-now, report) help crawl priority.

---

## “Crawled – currently not indexed” (e.g. story pages)

**What it means:** Google has **crawled** the page (you see a “Last crawled” date) but chose **not to index** it. Common reasons: thin or duplicate-looking content, or lower priority.

**Story pages (`/stories/[slug]/`):** These URLs previously shared the same placeholder body text (“Story content will be added here…”), so Google treated them as thin or duplicate. Changes made to improve indexing:

- **Unique visible content:** Each story page now has a short intro that combines the story title and the category theme phrase (e.g. “Prize, lottery, or charity scam story.”), so the main content is unique per URL.
- **Article structured data:** JSON-LD now includes `datePublished`, `dateModified`, and `mainEntityOfPage` so the page looks like a distinct article.

Adding full story content (real narratives) will further improve the chance of indexing. In the meantime, use **URL Inspection → Request indexing** for a few priority story URLs if you want to prompt recrawl.

---

## “Page with redirect”

See **docs/DEPLOYMENT.md** → “Canonical URL and redirects”. HTTP and www redirect to `https://scamenger.com/`. “Page with redirect” in GSC is expected for those variants; no action needed.

---

## Sitemap and canonical

- **Canonical base:** `https://scamenger.com/` (HTTPS, no www). Set via `PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_URL`.
- **Sitemap:** `frontend/app/sitemap.ts` builds the XML sitemap; `frontend/app/robots.ts` references it.
- **HTML sitemap:** `frontend/app/site-map/page.tsx` lists all main pages for users and crawlers (URL: `/site-map/`). The path is `site-map` to avoid conflicting with Next.js metadata route `app/sitemap.ts` (XML at `/sitemap.xml`).
