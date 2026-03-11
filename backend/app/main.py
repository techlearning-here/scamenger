"""
FastAPI application entry point.
Backend for Scam Avenger (e.g. report-scams API, auth, aggregation).
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, contact, reports
from app.routers.config import router as config_router, get_config as get_config_response

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


@app.get("/config")
def config():
    """Public config (show_facebook_consent, show_report_scam). Also on config router when ROOT_PATH is set."""
    return get_config_response()


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
