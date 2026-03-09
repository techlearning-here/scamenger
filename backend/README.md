# Scam Avenger – FastAPI backend

Backend for the Scam Avenger app (report-scams platform, auth, aggregated trends). Deploy to **Render**; frontend (Next.js) lives in `../frontend` and is deployed to Vercel.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run locally

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

## Environment (Supabase)

We use **two Supabase projects**: one for development, one for production. Same schema in both; different URLs and keys per environment.

**Local development**

1. Create a **development** Supabase project (e.g. scamenger-dev) and run `supabase/migrations/001_schema.sql` in its SQL Editor.
2. Copy `backend/.env.example` to `backend/.env` and set:
   - **SUPABASE_URL** – Dev project URL (Project Settings → API)
   - **SUPABASE_SERVICE_ROLE_KEY** – Dev project service_role key (keep secret)

**Production (e.g. Render)**

Set **SUPABASE_URL** and **SUPABASE_SERVICE_ROLE_KEY** to the **production** Supabase project’s values in the service Environment tab. Run `001_schema.sql` on that project once if you haven’t already.

Do not commit `.env`; it holds secrets. The app starts without these; Supabase is required for report-scams endpoints.

## Tests (TDD)

```bash
pip install -r requirements-dev.txt
pytest
```

Write tests first in `tests/`, then implement. See **docs/TDD.md** for the TDD guide.

## Deploy (Render)

- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set **Root Directory** to `backend` in Render service settings.
- **Environment:** Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your **production** Supabase project (two-project setup: use prod project here, dev project in local `.env`).

## Future

- Report-scams CRUD and shareable report URLs
- Supabase client for reports, users, ratings
- Aggregated trends endpoints (no PII)
- Auth (e.g. Supabase Auth or JWT) for viewing/rating reports

See project **docs/FeatureList.md** (Top priority – Report scams platform) for scope.
