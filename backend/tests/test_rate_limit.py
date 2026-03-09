"""Tests for rate limiting on POST /contact and POST /reports."""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_supabase_contact():
    """Mock Supabase so contact insert succeeds."""
    with patch("app.routers.contact.get_supabase") as m:
        sb = MagicMock()
        sb.table.return_value.insert.return_value.execute.return_value = MagicMock(
            data=[{
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Test",
                "email": "test@example.com",
                "message": "Hello",
                "read": False,
                "created_at": "2025-01-01T12:00:00Z",
            }]
        )
        m.return_value = sb
        yield m


@pytest.fixture
def mock_supabase_reports():
    """Mock Supabase so reports insert succeeds."""
    with patch("app.routers.reports.get_supabase") as m:
        sb = MagicMock()
        sb.table.return_value.insert.return_value.execute.return_value = MagicMock(
            data=[{
                "id": "550e8400-e29b-41d4-a716-446655440001",
                "slug": "abc123def456",
                "country_origin": "US",
                "report_type": "website",
                "category": None,
                "lost_money": False,
                "lost_money_range": None,
                "narrative": "Test narrative",
                "consent_share_authorities": True,
                "created_at": "2025-01-01T12:00:00Z",
                "status": "pending",
                "submitter_view_token": "tok",
            }]
        )
        m.return_value = sb
        yield m


def test_contact_rate_limit_returns_429_after_limit_exceeded(client, mock_supabase_contact):
    """POST /contact returns 429 after exceeding rate limit (5 per minute)."""
    with patch("app.rate_limit.CONTACT_LIMIT", (2, 60)):
        payload = {"name": "A", "email": "a@b.co", "message": "Hi"}
        for _ in range(2):
            r = client.post("/contact", json=payload)
            assert r.status_code == 201
        r = client.post("/contact", json=payload)
        assert r.status_code == 429
        data = r.json()
        assert "detail" in data
        assert "too many" in data["detail"].lower() or "try again" in data["detail"].lower()
        assert r.headers.get("retry-after") == "60"


def test_reports_rate_limit_returns_429_after_limit_exceeded(client, mock_supabase_reports):
    """POST /reports returns 429 after exceeding rate limit (10 per minute)."""
    with patch("app.rate_limit.REPORTS_LIMIT", (2, 60)):
        payload = {
            "country_origin": "US",
            "report_type": "website",
            "narrative": "Test",
            "consent_share_authorities": True,
        }
        for _ in range(2):
            r = client.post("/reports", json=payload)
            assert r.status_code == 201
        r = client.post("/reports", json=payload)
        assert r.status_code == 429
        data = r.json()
        assert "detail" in data
        assert "too many" in data["detail"].lower() or "try again" in data["detail"].lower()
        assert r.headers.get("retry-after") == "60"


def test_rate_limit_uses_x_forwarded_for_when_present(client, mock_supabase_contact):
    """Rate limit key uses X-Forwarded-For when present (first IP)."""
    with patch("app.rate_limit.CONTACT_LIMIT", (1, 60)):
        payload = {"name": "A", "email": "a@b.co", "message": "Hi"}
        r1 = client.post("/contact", json=payload, headers={"x-forwarded-for": "192.168.1.1"})
        assert r1.status_code == 201
        r2 = client.post("/contact", json=payload, headers={"x-forwarded-for": "192.168.1.1"})
        assert r2.status_code == 429
        # Different IP is not limited
        r3 = client.post("/contact", json=payload, headers={"x-forwarded-for": "10.0.0.1"})
        assert r3.status_code == 201
