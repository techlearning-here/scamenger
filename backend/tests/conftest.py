"""Pytest fixtures for FastAPI app."""
import os

import pytest
from fastapi.testclient import TestClient

# Set admin env vars before app import so config uses them in tests
os.environ.setdefault("ADMIN_USERNAME", "11111111-1111-4111-a111-111111111111")
os.environ.setdefault("ADMIN_PASSWORD", "22222222-2222-4222-a222-222222222222")
os.environ.setdefault("ADMIN_SECRET", "dev-secret-change-in-production-tests")

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """Return a test client for the FastAPI app."""
    return TestClient(app)
