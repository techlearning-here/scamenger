"""
FastAPI application entry point.
Backend for Scam Avenger (e.g. report-scams API, auth, aggregation).
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import admin, contact, reports
from app.routers.config import router as config_router

app = FastAPI(
    title="Scam Avenger API",
    description="Backend for Scam Avenger – reports, auth, and aggregated trends.",
    version="0.1.0",
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


app.include_router(reports.router)
app.include_router(config_router)
app.include_router(contact.router)
app.include_router(admin.router)
