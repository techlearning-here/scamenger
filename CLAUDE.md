# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start local dev server (http://localhost:4321)
npm run build    # Build static site to dist/
npm run preview  # Preview the built site locally
```

No test suite exists in this project.

## Architecture

**Scam Avenger** (`scamenger.com`) is a US-focused static directory site built with Astro. It helps people find official government reporting channels (FTC, IC3, CFPB, etc.) for scams and corruption. The site does not take reports itself.

### Data layer

All scam content lives in `src/data/scams/`:
- `types.ts` — TypeScript interfaces (`UsScamType`, `ScamReport`, `ScamFaqItem`, etc.) and `SCAM_CATEGORY_LABELS`
- `data.ts` — the large array `US_SCAMS` with every scam entry
- `index.ts` — helper functions: `getUsScamTypes()`, `getUsScamBySlug(slug)`, `getUsScamSlugs()`, `getUsScamCategories()`
- `src/data/us-scams.ts` — re-exports everything from `./scams/` (kept for backward compatibility)

Each `UsScamType` entry has: `slug`, `name`, `category`, `story`, `intro`, `steps`, `reports` (array of `ScamReport` with `who/when/prepare/href/label`), and optional fields like `spotIt`, `dos`, `donts`, `warning`, `statistics`, `relatedSlugs`, `faq`, `learnMore`.

### Pages

- `src/pages/index.astro` — Home/country picker. Renders a "popular guides" block and a JS-driven table that shows scam types when a country is selected. Scam data is passed to client JS via `define:vars`.
- `src/pages/us/scams/[slug].astro` — Dynamic detail pages for every scam type. Uses `getStaticPaths()` to generate one page per slug.
- `src/pages/us/*.astro` — Static category pages (financial-banking, online-phone-scams, etc.)
- `src/pages/news/index.astro` — Fetches FTC/IC3/CFPB RSS feeds **at build time** to populate news
- `src/pages/sitemap-index.xml.ts` — Sitemap via `@astrojs/sitemap`

### Layout and routing

`src/layouts/Layout.astro` wraps every page. It handles: full `<head>` with SEO meta, canonical URLs, Open Graph/Twitter cards, JSON-LD, Google Fonts, and optional Google AdSense blocks.

**Base URL:** The site is deployed under `/scamenger/` on GitHub Pages. All internal links must use `import.meta.env.BASE_URL` as a prefix (e.g., `` `${import.meta.env.BASE_URL}us/scams/${slug}/` ``). This is already set via `base: '/scamenger/'` in `astro.config.mjs`.

### Deployment

Deployed to GitHub Pages at `https://techlearning-here.github.io/scamenger/`. The workflow in `.github/workflows/scheduled-build.yml` runs every 2 days (and on manual trigger) to rebuild the site and refresh the News page RSS content.

### AdSense (optional)

Ads only render when these env vars are set at build time:
- `PUBLIC_ADSENSE_CLIENT` — publisher ID
- `PUBLIC_ADSENSE_SLOT_MAIN` — bottom-of-content ad slot
- `PUBLIC_ADSENSE_SLOT_TOP` — (optional) top-of-content ad slot

Set as GitHub Actions secrets and pass them in the workflow `env:` block, or use a local `.env` file (not committed).

### Adding a new scam type

Add an entry to the `US_SCAMS` array in `src/data/scams/data.ts` following the `UsScamType` interface. The slug determines the URL: `/us/scams/{slug}/`. No other file changes are needed for the detail page — `getStaticPaths()` picks it up automatically. To surface it in a category page, add a link in the relevant `src/pages/us/*.astro` file.

### GitHub CLI authentication

Credentials are stored in `frontend/.secrets` (gitignored). Before running any `gh` CLI command, load the token:

```bash
source frontend/.secrets && GH_TOKEN="$GH_TOKEN" gh <command>
# or export for the session:
export $(cat frontend/.secrets | xargs) && gh <command>
```

### Adding a new country

Country content goes under `src/pages/{country-code}/`. The root index page is a country picker; add the new country as an `<option>` there and populate its scam topics similarly to the US data pattern.
