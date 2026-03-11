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

   **Optional:** If the API is served behind a proxy that does **not** strip the path (e.g. all requests arrive as `https://your-domain.com/api/...`), set `ROOT_PATH=api` so that routes are mounted under `/api` (e.g. `/api/z7k2m9/messages`). In that case, set the frontend’s `NEXT_PUBLIC_API_URL` to the full base including the path (e.g. `https://your-domain.com/api`). If the backend is reached at the root (e.g. `https://scam-avenger-api.onrender.com/z7k2m9/...`), leave `ROOT_PATH` unset.

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
   If the backend is on Render’s free tier, it may spin down after inactivity. Open `https://<your-render-url>/health` in a browser; if it loads (even slowly), the service is up. The first request after spin-down can take 30–60 seconds.

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
