# Deploying Scam Avenger to GitHub Pages

Country-specific content lives under paths like `/us/`, so adding more countries later is just adding e.g. `src/pages/uk/` or `src/pages/ca/`. The root `/` is a country picker.

## Build

```bash
npm install
npm run build
```

Output is in `dist/`. That folder is what you deploy.

## GitHub Pages (project site)

1. Push this repo to GitHub (e.g. `username/scam-avenger`).

2. If the site will live at `username.github.io/scam-avenger/`, set the base path in `astro.config.mjs`:

   ```js
   export default defineConfig({
     site: 'https://username.github.io',
     base: '/scam-avenger/',
   });
   ```

3. In the repo: **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: `main` (or your default), folder: **/ (root)** or **/docs**.
   - If you use **root**: add a GitHub Action to build Astro and publish `dist/` (recommended).
   - If you use **docs**: run `npm run build` locally and commit the contents of `dist/` into a `docs` folder; set “Branch: main, /docs”.

### Option A: Deploy from GitHub Actions (recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@3
        with:
          path: dist
  deploy:
    environment: github-pages
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@4
```

Then in repo **Settings → Pages**, set Source to **GitHub Actions**. Pushing to `main` will build and deploy.

The **scheduled-build** workflow (`.github/workflows/scheduled-build.yml`) runs every 2 days and also builds and deploys to GitHub Pages, so the News page (RSS-fed at build time) stays updated without a push.

To enable AdSense, add repository secrets `PUBLIC_ADSENSE_CLIENT` and `PUBLIC_ADSENSE_SLOT_MAIN` (and optionally `PUBLIC_ADSENSE_SLOT_TOP` for a separate top ad unit), then in the workflow add before `npm run build`:

```yaml
env:
  PUBLIC_ADSENSE_CLIENT: ${{ secrets.PUBLIC_ADSENSE_CLIENT }}
  PUBLIC_ADSENSE_SLOT_MAIN: ${{ secrets.PUBLIC_ADSENSE_SLOT_MAIN }}
  PUBLIC_ADSENSE_SLOT_TOP: ${{ secrets.PUBLIC_ADSENSE_SLOT_TOP }}
```

(Or use a `.env` file locally and ensure it is not committed.)

## Google AdSense

Ads are optional and only appear when these environment variables are set at **build time**. Ads show on **every page** (Layout wraps all pages).

- `PUBLIC_ADSENSE_CLIENT` – your publisher ID (e.g. `ca-pub-xxxxxxxxxxxxxxxx`)
- `PUBLIC_ADSENSE_SLOT_MAIN` – ad unit/slot ID for the placement below content (above footer)
- `PUBLIC_ADSENSE_SLOT_TOP` – (optional) ad unit/slot ID for the placement at the top of main content (below header). If unset, the top placement uses `PUBLIC_ADSENSE_SLOT_MAIN` so you can use one ad unit for both positions.

**Placements:** Top of content (below nav) and bottom (above footer). Set both secrets in your GitHub Actions workflow (and in `.env` locally if you use it) so builds include ads.

## Custom domain

If you use a custom domain (e.g. scamenger.com), set `site` in `astro.config.mjs` to your full URL and configure the domain in GitHub Pages settings.
