"""
FastAPI application entry point.
Backend for Scam Avenger (e.g. report-scams API, auth, aggregation).
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.cache import get_config_cached, set_config_cached
from app.db.supabase import get_supabase
from app.routers import admin, contact, reports
from app.routers.config import router as config_router

# When behind a proxy that does not strip the path (e.g. /api), set ROOT_PATH so routes match.
# Example: ROOT_PATH=/api → admin at /api/z7k2m9, reports at /api/reports.
ROOT_PATH = (os.environ.get("ROOT_PATH") or "").strip("/")
PATH_PREFIX = f"/{ROOT_PATH}" if ROOT_PATH else ""

app = FastAPI(
    title="Scam Avenger API",
    description="Backend for Scam Avenger – reports, auth, and aggregated trends.",
    version="0.1.0",
    root_path=f"/{ROOT_PATH}" if ROOT_PATH else None,
)

@app.on_event("startup")
def log_routes():
    """Log registered routes at startup (helps debug 404 on Render)."""
    for r in app.routes:
        if hasattr(r, "path"):
            methods = getattr(r, "methods", None) or getattr(r, "path", "")
            print(f"ROUTE: {methods} {r.path}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    """Health check for Render / load balancers. Returns 200 with {"status": "ok"}."""
    return {"status": "ok"}


@app.head("/health")
def health_head():
    """Health check (HEAD) for Render / load balancers."""
    return None


@app.get("/")
def root():
    """API root."""
    return {"service": "Scam Avenger API", "docs": "/docs"}


def _config_response() -> dict:
    """Public config for frontend. Inlined so /config always works at app root (e.g. on Render)."""
    cached = get_config_cached()
    if cached is not None:
        return cached
    sb = get_supabase()
    show_fb = True
    show_report = True
    if sb:
        try:
            for key, default in (("show_facebook_consent", True), ("show_report_scam", True)):
                r = sb.table("site_settings").select("value").eq("key", key).limit(1).execute()
                if r.data and len(r.data) > 0:
                    val = r.data[0].get("value", default)
                    if isinstance(val, bool):
                        v = val
                    elif isinstance(val, str) and val.lower() in ("true", "1", "yes"):
                        v = True
                    else:
                        v = bool(val) if val is not None else default
                    if key == "show_facebook_consent":
                        show_fb = v
                    else:
                        show_report = v
        except Exception:
            pass
    result = {"show_facebook_consent": show_fb, "show_report_scam": show_report}
    set_config_cached(result)
    return result


@app.get("/config", tags=["config"])
def config():
    """Public config (show_facebook_consent, show_report_scam). Served at app root for Render."""
    return _config_response()


if PATH_PREFIX:
    app.include_router(reports.router, prefix=PATH_PREFIX)
    app.include_router(config_router, prefix=PATH_PREFIX)
    app.include_router(contact.router, prefix=PATH_PREFIX)
    app.include_router(admin.router, prefix=PATH_PREFIX)
else:
    app.include_router(reports.router)
    app.include_router(config_router)
    app.include_router(contact.router)
    app.include_router(admin.router)
