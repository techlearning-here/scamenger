# Deploying Scam Avenger to Vercel

The app is **Next.js** (App Router) with static export and lives in the **`frontend/`** directory. Country-specific content lives under paths like `/us/`.

## Build

```bash
cd frontend
npm install
npm run build
```

Static output is in `frontend/out/`. Vercel runs the build from the `frontend` root (see below).

## Vercel

1. **Import the project**
   - Push this repo to GitHub. In [Vercel](https://vercel.com), click **Add New → Project**, import the repo.
   - Set **Root Directory** to **`frontend`** (Project → Settings → General → Root Directory). Vercel will then detect Next.js and run `npm run build` from `frontend/`.

2. **Environment variables (optional)**
   - **`PUBLIC_SITE_URL`** or **`NEXT_PUBLIC_SITE_URL`** — Canonical site URL for sitemap, canonicals, and metadata. Set to your production URL (e.g. `https://scamenger.com`) or the Vercel URL. If unset, the app uses `https://scamenger.com`.
   - For AdSense: add **`NEXT_PUBLIC_ADSENSE_CLIENT`**, **`NEXT_PUBLIC_ADSENSE_SLOT_MAIN`**, and optionally **`NEXT_PUBLIC_ADSENSE_SLOT_TOP`** in **Settings → Environment Variables** (these are exposed to the client).

3. **Deploy**
   - Every push to the main branch triggers a new deployment. Preview deployments are created for pull requests.

4. **Custom domain**
   - In Vercel: **Project → Settings → Domains**, add your domain. Set **`PUBLIC_SITE_URL`** (or **`NEXT_PUBLIC_SITE_URL`**) to that URL.

## Refreshing the build on a schedule (e.g. News page)

The **News** page fetches FTC/IC3/CFPB RSS at **build time**. To refresh without a push:

1. **Vercel Deploy Hook** — In **Project → Settings → Git → Deploy Hooks**, create a hook and copy the URL.
2. **GitHub Actions** — Add repo secret **`VERCEL_DEPLOY_HOOK_URL`** with that URL. The workflow in `.github/workflows/scheduled-build.yml` runs every 2 days and calls the hook so Vercel rebuilds (refreshing news).
3. Or call the deploy hook from any external cron.

## Google AdSense

Set at build time in Vercel (Production/Preview as needed):

- **`NEXT_PUBLIC_ADSENSE_CLIENT`** — Publisher ID (e.g. `ca-pub-xxxxxxxxxxxxxxxx`)
- **`NEXT_PUBLIC_ADSENSE_SLOT_MAIN`** — Ad unit for below content
- **`NEXT_PUBLIC_ADSENSE_SLOT_TOP`** — (optional) Ad unit for top of content

## Sitemap and robots

- The app serves **`/sitemap.xml`** (generated from `app/sitemap.ts`) and **`/robots.txt`** (from `app/robots.ts`). Both use **`PUBLIC_SITE_URL`** or **`NEXT_PUBLIC_SITE_URL`** when set. Paths are relative to the `frontend/` directory.
- Submit `https://<your-domain>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools.
