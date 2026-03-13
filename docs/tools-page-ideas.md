# Tools Page — Ideas for Improvement

Suggestions that would add value without changing the core data model. Pick by impact vs effort.

---

## Quick wins

| Idea | What to do | Why |
|------|------------|-----|
| **Filter by tag** | Add checkboxes or pills above the list: "Show: Prevent · Free · For victims · Report · Third party · Important". Filter cards so only tools matching selected tags show. | Users in a hurry (e.g. "only free" or "only for victims") find the right tool faster. |
| **Jump links** | Add in-page links at the top: "Jump to: Identity & credit · Protect & avoid scams · Recover". | Long page; quick navigation to the section they need. |
| **Print / PDF** | "Print this page" or "Save as PDF" button. | Users can take the list to a bank, police, or support worker offline. |
| **External link indicator** | Small icon or "(opens in new tab)" after external links so it’s obvious they leave the site. | Accessibility and set expectations. |
| **Tool count** | Line under the lead: "X tools for [Country]" or "Y official, Z third-party tools". | Sets expectations and builds trust. |

---

## Medium effort

| Idea | What to do | Why |
|------|------------|-----|
| **Search** | Search box: filter by tool name, description, or site name. | Helpful when the list grows or on small screens. |
| **Collapsible benefits** | Show "Why use this?" or "Benefits" as a toggle/expand instead of always visible. | Less scroll; page feels lighter. |
| **Suggest a tool / Report broken link** | Link at bottom: "Suggest a tool" or "Report broken link" → form or mailto. | Keeps the list accurate and invites community input. |
| **RSS / scam alerts** | If official sites (e.g. FTC, Scamwatch) offer RSS, add a "Subscribe to scam alerts" link per country. | Recurring engagement; aligns with Feature List 15b/15c. |
| **Sort within section** | "Sort: A–Z · Important first · Free first" per section. | Personal preference; important/free first helps some users. |

---

## Larger / roadmap

| Idea | What to do | Why |
|------|------------|-----|
| **"How to use these tools"** | Short guide (accordion or modal): when to use Prevent vs Recover, how to report, what to expect. | Reduces confusion; supports wizard/guided experience (Feature List #4). |
| **Last verified date** | Optional `lastVerified` (or section-level "Links checked MM/YYYY") in data + UI. | Trust and maintenance signal; needs a process to update. |
| **Mobile: compact view** | Toggle "Compact list" vs "Full cards" so mobile users can scan names only. | Better on small screens when there are many tools. |
| **i18n** | If the app gets localization, translate section intros, tag legend, and (where possible) tool descriptions. | Consistency with multi-country support. |

---

## Already in place

- Country selector and URL `?country=`
- Tags legend (Prevent, Free, For victims, Report, Important, Third party)
- Favicons and site names
- Star on the right for important tools
- Scam Avenger favicon for internal "Report a scam" link
- Clear section order (Identity & credit first, then Protect, then Recover)
- CTA for preventive tools and link to Need help now

---

Recommendation: start with **jump links** and **tool count** (quick, no new state), then **filter by tag** if you want more interactivity.
