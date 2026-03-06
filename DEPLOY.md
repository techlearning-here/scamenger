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

To enable AdSense, add repository secrets `PUBLIC_ADSENSE_CLIENT` and `PUBLIC_ADSENSE_SLOT_MAIN`, then in the workflow add before `npm run build`:

```yaml
env:
  PUBLIC_ADSENSE_CLIENT: ${{ secrets.PUBLIC_ADSENSE_CLIENT }}
  PUBLIC_ADSENSE_SLOT_MAIN: ${{ secrets.PUBLIC_ADSENSE_SLOT_MAIN }}
```

(Or use a `.env` file locally and ensure it is not committed.)

## Google AdSense

Ads are optional and only appear when these environment variables are set at **build time**:

- `PUBLIC_ADSENSE_CLIENT` – your publisher ID (e.g. `ca-pub-xxxxxxxxxxxxxxxx`)
- `PUBLIC_ADSENSE_SLOT_MAIN` – ad unit/slot ID for the main placement (below content, above footer)

Copy `.env.example` to `.env`, fill in the values from your [AdSense](https://www.google.com/adsense/) account, then build. If either variable is missing, no ad script or placeholder is included.

## Custom domain

If you use a custom domain (e.g. scamenger.com), set `site` in `astro.config.mjs` to your full URL and configure the domain in GitHub Pages settings.
