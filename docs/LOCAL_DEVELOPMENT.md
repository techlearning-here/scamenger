# Running Backend and Frontend Locally

This guide explains how to run the Scam Avenger **backend** (FastAPI) and **frontend** (Next.js) on your machine for development.

---

## Prerequisites

- **Python 3.10+** (for the backend)
- **Node.js 18+** and **npm** (for the frontend)
- A **Supabase** project (for reports, contact messages, and optional auth). Create one at [supabase.com](https://supabase.com) if needed.

---

## 1. Supabase (one-time)

1. Create a Supabase project (e.g. **scamenger-dev**).
2. In the **SQL Editor**, run the migration:
   - Open `supabase/migrations/001_full_schema.sql` and execute its contents in the SQL Editor.
3. **(Optional)** Load and verify seed data (see **[docs/SEED_DATA.md](SEED_DATA.md)**): run `supabase/scripts/seed.sql`, then `supabase/scripts/verify_seed.sql`. The migration already inserts default `site_settings`; the seed script is the canonical way to ensure initial data matches `supabase/seed/data.json`.
4. In **Project Settings → API**, note:
   - **Project URL** → you’ll use this as `SUPABASE_URL`
   - **service_role key** → you’ll use this as `SUPABASE_SERVICE_ROLE_KEY` (backend only; keep secret)
   - **anon key** → for frontend as `NEXT_PUBLIC_SUPABASE_ANON_KEY` if the frontend uses Supabase (e.g. auth)

---

## 2. Backend

### Setup (first time)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Environment

Copy the example env and set your values:

```bash
cp .env.example .env
```

Edit `backend/.env` and set at least:

- **SUPABASE_URL** – your Supabase project URL  
- **SUPABASE_SERVICE_ROLE_KEY** – your Supabase service_role key  

For **admin login** (e.g. `/z7k2m9/`): set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` in `backend/.env` (see `backend/.env.example`). All three are required; use strong values (e.g. UUIDs for username/password, at least 32 characters for `ADMIN_SECRET`).

### Run

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **API root:** http://localhost:8000  
- **Docs:** http://localhost:8000/docs  
- **Health:** http://localhost:8000/health  

Leave this terminal running.

---

## 3. Frontend

### Setup (first time)

```bash
cd frontend
npm install
```

### Environment

Copy the example env and set your values:

```bash
cp .env.example .env.local
```

Edit `frontend/.env.local` and set at least:

- **NEXT_PUBLIC_API_URL** – `http://localhost:8000` (so the frontend talks to your local backend)
- **NEXT_PUBLIC_SUPABASE_URL** – your Supabase project URL (if the frontend uses Supabase)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** – your Supabase anon key (if the frontend uses Supabase)

Other variables (e.g. contact email, social links) are optional; see `frontend/.env.example`.

### Run

```bash
npm run dev
```

- **App:** http://localhost:3000  

Leave this terminal running.

---

## 4. Quick reference

| Step        | Directory  | Command |
|------------|------------|--------|
| Start backend  | `backend`  | `source .venv/bin/activate` then `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` |
| Start frontend | `frontend` | `npm run dev` |

Use **two terminals**: one for the backend, one for the frontend.

- Open **http://localhost:3000** in the browser for the site.
- Use **http://localhost:8000/docs** to call the API directly.
- Admin dashboard (after setting admin credentials in `backend/.env`): **http://localhost:3000/z7k2m9/**.

---

## 5. Troubleshooting

- **Backend won’t start:** Ensure `.env` exists and `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set. The app will start without them but report/contact endpoints will fail.
- **GET /config or POST /z7k2m9/login returns 404:** Do **not** set `ROOT_PATH` in `backend/.env` for local development. `ROOT_PATH` is only for deployments where the API is served under a path (e.g. `/api`). With it set, the backend only serves routes under that path (e.g. `/api/config`), so the frontend’s `http://localhost:8000/config` would 404.
- **Frontend can’t reach API:** Ensure `NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local`. Restart `npm run dev` after changing env vars.
- **Admin login fails:** Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SECRET` in `backend/.env` (all three required). See `backend/.env.example`.
- **Reports or contact form fail:** Run `supabase/migrations/001_full_schema.sql` on your Supabase project and confirm `.env` / `.env.local` use the same project URL and keys.
