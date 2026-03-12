# Scam Avenger – Deployment Guide (Vercel + Render)

This document describes how to deploy **Scam Avenger** with:

- **Frontend (Next.js)** → [Vercel](https://vercel.com)
- **Backend (FastAPI)** → [Render](https://render.com)
- **Database** → [Supabase](https://supabase.com) (migrations and data)

GitHub Pages and static-export–only builds are not used; the frontend is built and served by Vercel as a standard Next.js app.

---

## Prerequisites

- A **Supabase** project (for reports and optional auth).
- **Vercel** and **Render** accounts (GitHub login supported for both).
- This repository pushed to **GitHub** (or another Git provider supported by Vercel/Render).

---

## 1. Supabase setup

We use **two Supabase projects**: one for **production** (used by Render and Vercel), one for **development** (used in local `backend/.env`). Run the same migration on both; use each project’s URL and keys in the corresponding environment.

1. **Production:** Create a project at [supabase.com](https://supabase.com) (e.g. **scamenger-prod**). Run `supabase/migrations/001_schema.sql` and `supabase/migrations/002_contact_messages.sql` in **SQL Editor**. Use this project’s URL and keys for Render and Vercel (steps 2–3 below).
2. **Development (optional):** Create a second project (e.g. **scamenger-dev**), run `001_schema.sql` and `002_contact_messages.sql` there too, and use its URL and service_role key in `backend/.env` for local development.
3. In **Project Settings → API** (for each project), note:
   - **Project URL** → `SUPABASE_URL`
   - **anon (public) key** → for frontend (e.g. `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** → for backend only (`SUPABASE_SERVICE_ROLE_KEY`; keep secret).

---

## 2. Deploy backend (Render)

1. In [Render](https://render.com), go to **Dashboard → New → Web Service**.
2. Connect your repository and select this repo.
3. Configure the service:
   - **Name:** e.g. `scam-avenger-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:**  
     `pip install -r requirements.txt`
   - **Start Command:**  
     `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance type:** Free or paid (Free tier may spin down after inactivity).

4. **Environment variables** (Render → Service → **Environment**):

   | Key | Value | Notes |
   |-----|--------|--------|
   | `SUPABASE_URL` | Your Supabase project URL | From Supabase → Project Settings → API |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key | Backend only; keep secret |

   **Important for standard deployment:** Do **not** set `ROOT_PATH` on Render. Routes (e.g. `/z7k2m9/messages`, `/config`) are served at the root. Only set `ROOT_PATH` if you put the API behind a proxy that adds a path prefix (e.g. `/api`); then set `NEXT_PUBLIC_API_URL` on Vercel to include that path (e.g. `https://scamenger.onrender.com/api`).

   **Optional – Facebook posting:** To let admins post approved reports to your Scam Avenger Facebook Page from the admin UI, set:
   - `FACEBOOK_PAGE_ID` – the numeric Page ID (from Meta Business Suite → Page settings, or Graph API).
   - `FACEBOOK_PAGE_ACCESS_TOKEN` – a Page access token with `pages_manage_posts` and `pages_read_engagement`. To obtain one: create an app at [developers.facebook.com](https://developers.facebook.com), add the **Facebook Login** product, then use **Graph API Explorer** or your app’s **Tools** to generate a User token, exchange it for a long-lived token, and then request the Page token via `GET /me/accounts`. Store the token in Render (and optionally in `backend/.env` for local testing). If either variable is unset, the “Post to Facebook” button is hidden and the API returns 503 for post requests.

5. Deploy. After the first successful deploy, copy the **service URL** (e.g. `https://scam-avenger-api.onrender.com`). You will use this as the frontend’s API base URL.

---

## 3. Deploy frontend (Vercel)

1. In [Vercel](https://vercel.com), go to **Add New → Project** and import your repository.
2. Configure the project:
   - **Root Directory:** `frontend`  
     (Vercel will detect Next.js and use `npm run build` / `npm start`.)
   - **Framework Preset:** Next.js (auto-detected).

3. **Environment variables** (Vercel → Project → **Settings → Environment Variables**):

   | Variable | Value | Required |
   |----------|--------|----------|
   | `NEXT_PUBLIC_API_URL` | Your Render backend URL (e.g. `https://scam-avenger-api.onrender.com`) | Yes (for report form and report view) |
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes (if using Supabase from frontend) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes (if using Supabase from frontend) |
   | `PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_URL` | Production site URL (e.g. `https://yoursite.com`) | Optional; used for sitemap, canonicals, share URL |

   For **Production**, set these so the live site talks to your Render API and Supabase.

4. Deploy. Each push to the main branch triggers a new production deployment; PRs get preview deployments.

---

## 4. Post-deploy checklist

- **Frontend → Backend:** In Vercel, ensure `NEXT_PUBLIC_API_URL` is exactly the Render service URL (no trailing slash). The report form and report-by-slug page call this API.
- **CORS:** The backend allows all origins (`allow_origins=["*"]`). For production you can restrict this to your Vercel domain(s) in `backend/app/main.py` if desired.
- **Health check URLs:** See [Health check URLs (Render & Vercel)](#health-check-urls-render--vercel) below.
- **Report flow:** Submit a test report from the Vercel-deployed site and open the shareable report link.
- **Contact form:** The public contact form (`/contact`) submits messages to the backend; they are stored in the `contact_messages` table (created by `002_contact_messages.sql`). Admins can view, read, and delete messages at **Admin → View messages** (`/z7k2m9/messages/`).

### Health check URLs (Render & Vercel)

Both the backend and frontend expose a **health check** endpoint so Render and Vercel can verify the service is running.

| Service   | Health check URL                    | Response        |
|-----------|-------------------------------------|-----------------|
| **Backend (Render)**  | `https://<your-render-service-url>/health` | `{"status":"ok"}` |
| **Frontend (Vercel)** | `https://<your-vercel-domain>/health`      | `{"status":"ok"}` |

**Render (backend)**  
- In the Web Service → **Settings**, set **Health Check Path** to `/health`.  
- Render will call `GET https://<your-render-url>/health` periodically; a 200 response is treated as healthy.  
- Optional: **HEAD** `/health` is also supported for lighter probes.

**Vercel (frontend)**  
- The Next.js app serves **GET** and **HEAD** `/health` (see `frontend/app/health/route.ts`).  
- Use `https://<your-vercel-domain>/health` for monitoring or uptime checks.  
- Vercel does not require a health path for standard deployments; this is useful for external monitoring or load balancers.

Manual check: open `https://<your-render-url>/health` and `https://<your-vercel-domain>/health` in a browser; both should return `{"status":"ok"}`.

### Troubleshooting: "Reports service unavailable"

If submitting a scam report from the Vercel site returns **"Reports service unavailable"**, the backend (Render) is returning 503 because it cannot use Supabase. Check the following:

1. **Render environment variables**  
   In Render → your Web Service → **Environment**:
   - **`SUPABASE_URL`** must be set to your Supabase project URL (e.g. `https://xxxxx.supabase.co`). No trailing slash.
   - **`SUPABASE_SERVICE_ROLE_KEY`** must be set to the **service_role** key from Supabase → Project Settings → API (not the anon key).
   - After changing env vars, trigger a **redeploy** so the new values are applied.

2. **Supabase migration**  
   The `reports` table must exist. In Supabase → **SQL Editor**, run `supabase/migrations/001_schema.sql` and `supabase/migrations/002_contact_messages.sql` for the same project whose URL and key you use on Render.

3. **Frontend API URL**  
   In Vercel → Project → **Settings → Environment Variables**, ensure **`NEXT_PUBLIC_API_URL`** is exactly your Render service URL (e.g. `https://scam-avenger-api.onrender.com`) with no trailing slash. Redeploy the frontend after changing it.

4. **Render service up**  
   If the backend is on Render’s free tier, it may spin down after inactivity. Open `https://<your-render-url>/health` in a browser; if it loads (even slowly), the service is up.    The first request after spin-down can take 30–60 seconds.

### Troubleshooting: 503 Service Unavailable (admin reports, messages, or report submit)

If **`GET /z7k2m9/reports`** or other admin/report endpoints return **503 (Service Unavailable)**, the backend cannot reach Supabase or the database call failed. Do the following:

1. **Render environment variables**  
   In Render → your backend service → **Environment**:
   - **`SUPABASE_URL`** must be your Supabase project URL (e.g. `https://xxxxx.supabase.co`), no trailing slash.
   - **`SUPABASE_SERVICE_ROLE_KEY`** must be the **service_role** key from Supabase → Project Settings → API (not the anon key). Copy the full key; no extra spaces.
   - Save and **redeploy** after any change.

2. **Supabase migration**  
   The `reports` (and related) tables must exist. In Supabase → **SQL Editor**, run **`supabase/migrations/001_full_schema.sql`** for the same project whose URL and key you use on Render.  
   To record when reports are posted to Facebook (admin view), also run **`supabase/migrations/002_facebook_post_tracking.sql`** (adds `facebook_post_id`, `facebook_posted_at`, `facebook_permalink` to `reports`).

3. **Render logs**  
   In Render → your service → **Logs**, check for Python tracebacks or Supabase/connection errors when the 503 occurs. That will confirm whether it's missing env, wrong key, or a DB/network error.

### Troubleshooting: Admin page / `GET /z7k2m9/messages` 404 (Not Found)

If the admin page on Vercel shows “Not Found” or the browser reports **`GET https://scamenger.onrender.com/z7k2m9/messages 404 (Not Found)`**:

1. **Render: remove `ROOT_PATH`**  
   In [Render](https://render.com) → your backend service (e.g. scamenger) → **Environment**:
   - If **`ROOT_PATH`** is set (e.g. to `api`), **delete it** or leave it blank. With `ROOT_PATH` set, the API only serves routes under that path (e.g. `/api/z7k2m9/messages`), so `https://scamenger.onrender.com/z7k2m9/messages` returns 404.
   - Save and **redeploy** the service so the change takes effect.

2. **Vercel: `NEXT_PUBLIC_API_URL`**  
   In Vercel → Project → **Settings → Environment Variables**:
   - **`NEXT_PUBLIC_API_URL`** must be exactly your Render URL with **no** path and **no** trailing slash (e.g. `https://scamenger.onrender.com`).  
   - If you intentionally use a path prefix on Render (e.g. `ROOT_PATH=api`), then set `NEXT_PUBLIC_API_URL` to `https://scamenger.onrender.com/api`. For the usual setup, do not set `ROOT_PATH` and use the root URL.
   - Redeploy the frontend after changing env vars.

3. **Verify**  
   Open `https://scamenger.onrender.com/health` — should return `{"status":"ok"}`.  
   Open `https://scamenger.onrender.com/docs` — admin routes are under `/z7k2m9/...`. If `/health` works but `/z7k2m9/messages` 404s, `ROOT_PATH` is still set on Render; remove it and redeploy.

---

## 5. Custom domain (optional)

- **Vercel:** In the project → **Settings → Domains**, add your domain and follow the DNS instructions. Set `PUBLIC_SITE_URL` (or `NEXT_PUBLIC_SITE_URL`) to that URL.
- **Render:** In the Web Service → **Settings → Custom Domains**, add a domain and configure DNS as shown.

---

## 6. Optional: AdSense and scheduled rebuilds

- **AdSense:** In Vercel, add `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_MAIN`, and optionally `NEXT_PUBLIC_ADSENSE_SLOT_TOP` if the app uses them.
- **Scheduled rebuilds:** If you need periodic rebuilds (e.g. for a News/RSS page), create a **Deploy Hook** in Vercel (Project → Settings → Git → Deploy Hooks) and call that URL from a cron job (e.g. Render Cron Job or an external scheduler). No GitHub Actions are required.

---

## 7. Local development

See **[docs/LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md)** for step-by-step instructions to run the backend and frontend locally, including env setup and Supabase migration.

---

## Summary

| Component | Host | Root | Key env vars |
|-----------|------|------|--------------|
| Frontend | Vercel | `frontend` | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_*`, `PUBLIC_SITE_URL` |
| Backend | Render | `backend` | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| DB / Auth | Supabase | — | Run migrations; use URL and keys in frontend/backend |

After deployment, the public site is the Vercel URL (or your custom domain). Reports are stored in Supabase and served via the Render API. Contact form submissions are stored in `contact_messages`; admins manage them at `/z7k2m9/messages/`.
