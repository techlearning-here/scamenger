"""
FastAPI application entry point.
Backend for Scam Avenger (e.g. report-scams API, auth, aggregation).
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    """Health check for Render / load balancers."""
    return {"status": "ok"}


@app.get("/")
def root():
    """API root."""
    return {"service": "Scam Avenger API", "docs": "/docs"}
