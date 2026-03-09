"""Tests for main API endpoints (TDD: write test first, then implement)."""
import pytest


def test_health_returns_ok(client):
    """GET /health returns 200 and status ok."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "ok"}


def test_root_returns_service_info(client):
    """GET / returns service name and docs link."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "Scam Avenger API"
    assert data["docs"] == "/docs"


def test_docs_available(client):
    """OpenAPI docs are served at /docs."""
    response = client.get("/docs")
    assert response.status_code == 200
