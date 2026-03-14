# Newsletter content (15n7)

**What to send** and **where content comes from** for the Scam Avenger newsletter. Subscriber preferences (15n6) are `topic` (alerts | guides | digest | all) and `frequency` (weekly | monthly | important_only). Use this when composing sends (15n8) or automating digests.

---

## 1. What to send

| Type | Description | When to use | Subscriber topic match |
|------|-------------|-------------|------------------------|
| **Digest** | Weekly or monthly round-up: new stories, top guides, “This week in scams.” | Scheduled (e.g. every Friday or first Monday of month). | `digest`, `all` |
| **One-off alert** | Single high-impact item: new guide, urgent scam warning, major new tool or story. | When you publish something important and want to notify quickly. | `alerts`, `guides` (if guide), `all` |
| **Personalized alerts** (later) | Alerts based on report/trend data or followed scam types (#15b / #15c). | When you have trend data and optional “follow category” feature. | `alerts`, `all` |

- **Digest** supports both “weekly” and “monthly” frequency; filter subscribers by `frequency` when sending.
- **One-off alert** fits “important only” (`important_only`) and “alerts” / “guides” / “all” topics.
- **Personalized alerts** are out of scope for 15n7; document when you add #15b/#15c.

---

## 2. Where content comes from (current)

All content is **static/code-driven** today. No CMS required for 15n7.

| Content | Source | How to get “new” or “recent” | URL pattern |
|---------|--------|------------------------------|-------------|
| **Stories** | `frontend/src/data/scam-stories.ts` — `SCAM_STORY_ENTRIES` | Array order = display order; newest entries are typically at the end. For “last N” use `.slice(-N).reverse()`. No publish date yet. | `/stories/[slug]/` |
| **US scam guides** | `frontend/src/data/scams/` — `getUsScamSlugs()`, `getUsScamTypes()` | No “published” date in data. “New” = manually track (e.g. a “new this month” list in code or config) or add `addedAt` later. | `/us/scams/[slug]/` |
| **Tools & protect pages** | `frontend/src/data/tools.ts`; pages under `app/tools/` | New pages = new routes (e.g. protect-phone, protect-laptop). List in sitemap; “new” = recent additions to repo. | `/tools/`, `/tools/protect-*`, `/tools/books/` |
| **Books** | `frontend/src/data/books.ts` — `BOOKS_LIST_LAST_UPDATED` | List updated when you add/change books; use `BOOKS_LIST_LAST_UPDATED` for “list updated” line in digest. | `/tools/books/` |
| **RSS** | `/stories/feed` | Same as Stories; RSS is built from `SCAM_STORY_ENTRIES`. Use for “latest stories” link in digest. | `/stories/feed`, `/stories/` |
| **Recent report stories** | `GET /api/reports/recent` (Supabase `reports`, `status = 'approved'`) | Returns recent approved community reports: id, slug, report_type, category, country_origin, created_at, narrative (truncated). Use `?limit=15` (max 30). For digest: “This week the community reported X scams” + 3–5 example links. | `/reports/?id={id}` |

Optional later:

- **CMS (e.g. Sanity)**: If you move stories or guides into a CMS, “new” = query by `publishedAt` or equivalent. 15n8 can then pull from API instead of code.
- **Aggregated data**: For “monthly scam trends” (#16b) or personalized alerts, content would come from Supabase (reports, trends) or an internal API.

---

## 3. Content checklist for a digest

Use this when building a **weekly or monthly digest** (e.g. for 15n8 manual send or future automation):

1. **Stories**  
   - From `SCAM_STORY_ENTRIES`: take last N (e.g. 5–10), reverse for “newest first.”  
   - For each: title, link `{siteUrl}/stories/{slug}/`, optional category.

2. **Guides**  
   - From `getUsScamSlugs()` or `getUsScamTypes()`: either “new this period” (if you maintain a list) or “featured” / “popular” (e.g. from sitemap or a fixed list).  
   - Link: `{siteUrl}/us/scams/{slug}/`.

3. **Tools / protect**  
   - Mention new or updated tools (e.g. “New: Protect your phone”) with link to `/tools/` or specific `/tools/protect-phone/`, etc.

4. **Books**  
   - Optional: “Updated reading list” with `BOOKS_LIST_LAST_UPDATED` and link to `/tools/books/`.

5. **Recent report stories (community reports)**  
   - Call `GET /api/reports/recent?limit=15` (same origin). Use `items` and `total`.  
   - Intro line e.g. “This week the community reported **X** new scams.”  
   - List 3–5 recent items: link text from `report_type` + `category` (or truncated `narrative`); link = `{siteUrl}/reports/?id={id}`.  
   - Optional: link to “Browse all reports” → `/reports/`.

6. **One-line intro**  
   - E.g. “This week in scams: new stories, updated guides, and tips to stay safe.”

7. **Footer**  
   - Unsubscribe link (e.g. `{siteUrl}/newsletter/unsubscribe?token={token}`); include for every subscriber (required by law).

---

## 4. Content checklist for a one-off alert

For a **single high-impact email** (new guide, urgent warning):

1. **One main item**: title, 1–2 sentences, CTA link.
2. **Optional**: 1–2 related links (e.g. another guide or story).
3. **Footer**: Unsubscribe link.

Send to subscribers whose `topic` includes the type (e.g. `alerts` or `guides` or `all`) and, if you use it, `frequency = important_only` for “alert” style sends.

---

## 5. Subscriber preferences (15n6) quick reference

- **topic**: `alerts` | `guides` | `digest` | `all`  
  - **alerts** → one-off scam alerts, urgent warnings.  
  - **guides** → new or updated guides (scam types, tools).  
  - **digest** → weekly/monthly round-up.  
  - **all** → everything above.

- **frequency**: `weekly` | `monthly` | `important_only`  
  - **weekly** → digest (and optionally alerts) at most weekly.  
  - **monthly** → digest (and optionally alerts) at most monthly.  
  - **important_only** → only high-impact/urgent alerts; no regular digest.

When implementing 15n8 (sending), filter `newsletter_subscribers` by `status = 'subscribed'` and then by `topic`/`frequency` so each send goes to the right segment.

---

## 6. Summary

| Question | Answer |
|----------|--------|
| **What to send?** | (1) Digest — weekly/monthly round-up of stories, guides, tools. (2) One-off alerts — single guide or warning. (3) Later: personalized alerts (#15b/#15c). |
| **Where does content come from?** | **Static**: `scam-stories.ts`, `scams/`, `tools.ts`, `books.ts`. **Dynamic**: recent report stories via `GET /api/reports/recent` (Supabase). Optional later: CMS (e.g. Sanity) or trend APIs. |
| **How to get “new” content?** | Stories: last N from `SCAM_STORY_ENTRIES`. Guides: maintain a “new” list or add `addedAt`. Tools/books: new routes or `BOOKS_LIST_LAST_UPDATED`. |

This completes the **content decision** for 15n7. Implementation of **compose and send** is 15n8 (provider API or admin UI).
