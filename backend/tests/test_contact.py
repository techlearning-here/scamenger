"""Tests for POST /contact (validation and behavior). TDD: tests first."""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_supabase_contact():
    """Mock Supabase so contact insert succeeds when we need it."""
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


def test_contact_returns_422_when_message_exceeds_max_length(client, mock_supabase_contact):
    """POST /contact returns 422 when message length exceeds 10_000 characters."""
    # Rate limit: use high limit so we don't get 429
    with patch("app.rate_limit.CONTACT_LIMIT", (100, 60)):
        payload = {
            "name": "Jane",
            "email": "jane@example.com",
            "message": "x" * 10_001,
        }
        response = client.post("/contact", json=payload, headers={"x-forwarded-for": "127.0.0.99"})
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        # Error should mention length or max (Pydantic validation)
        detail_str = str(data["detail"]).lower()
        assert "length" in detail_str or "max" in detail_str or "10000" in detail_str
        # Should not have called Supabase insert
        mock_supabase_contact.return_value.table.assert_not_called()


def test_contact_returns_422_when_email_format_invalid(client, mock_supabase_contact):
    """POST /contact returns 422 when email is not a valid email format."""
    with patch("app.rate_limit.CONTACT_LIMIT", (100, 60)):
        payload = {
            "name": "Jane",
            "email": "not-an-email",
            "message": "Hello",
        }
        response = client.post("/contact", json=payload, headers={"x-forwarded-for": "127.0.0.98"})
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data
        mock_supabase_contact.return_value.table.assert_not_called()
