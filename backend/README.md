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

## Deploy (Render)

- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set **Root Directory** to `backend` in Render service settings.

## Future

- Report-scams CRUD and shareable report URLs
- Supabase client for reports, users, ratings
- Aggregated trends endpoints (no PII)
- Auth (e.g. Supabase Auth or JWT) for viewing/rating reports

See project **docs/FeatureList.md** (Top priority – Report scams platform) for scope.
