"""Tests for admin API (login, list reports, approve, reject, delete)."""
import pytest
from unittest.mock import MagicMock, patch

# Default UUID credentials from config (used when env is not set)
ADMIN_USER = "11111111-1111-4111-a111-111111111111"
ADMIN_PASS = "22222222-2222-4222-a222-222222222222"


def test_admin_login_success(client):
    """POST /z7k2m9/login returns 200 and access_token for valid credentials."""
    response = client.post(
        "/z7k2m9/login",
        json={"username": ADMIN_USER, "password": ADMIN_PASS},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "bearer"
    assert "access_token" in data
    assert len(data["access_token"]) > 0


def test_admin_login_invalid_password(client):
    """POST /z7k2m9/login returns 401 for wrong password."""
    response = client.post(
        "/z7k2m9/login",
        json={"username": ADMIN_USER, "password": "wrong"},
    )
    assert response.status_code == 401
    assert "Invalid" in response.json()["detail"]


def test_admin_login_invalid_username(client):
    """POST /z7k2m9/login returns 401 for wrong username."""
    response = client.post(
        "/z7k2m9/login",
        json={"username": "wrong-uuid", "password": ADMIN_PASS},
    )
    assert response.status_code == 401


def test_admin_reports_requires_auth(client):
    """GET /z7k2m9/reports returns 401 without Bearer token."""
    response = client.get("/z7k2m9/reports")
    assert response.status_code == 401


def test_admin_stats_requires_auth(client):
    """GET /z7k2m9/stats returns 401 without Bearer token."""
    response = client.get("/z7k2m9/stats")
    assert response.status_code == 401


def test_admin_stats_returns_total_and_by_category(client):
    """GET /z7k2m9/stats returns 200 with total_approved and by_category when authenticated."""
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_table = MagicMock()
        mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
            data=[{"category": "phishing"}, {"category": "phishing"}, {"category": None}]
        )
        mock_sb.return_value.table.return_value = mock_table
        response = client.get(
            "/z7k2m9/stats",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["total_approved"] == 3
    assert isinstance(data["by_category"], list)
    categories = {item["category"]: item["count"] for item in data["by_category"]}
    assert categories.get("phishing") == 2
    assert categories.get(None) == 1


def test_admin_reports_returns_list(client):
    """GET /z7k2m9/reports returns 200 and paginated list when authenticated."""
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_table = MagicMock()
        sel = MagicMock()
        sel.order.return_value.range.return_value.execute.return_value = MagicMock(data=[])
        sel.execute.return_value = MagicMock(data=[])
        mock_table.select.return_value = sel
        mock_sb.return_value.table.return_value = mock_table
        response = client.get(
            "/z7k2m9/reports",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["items"] == []
    assert data["total"] == 0
    assert "page" in data
    assert "page_size" in data


def test_admin_approve_requires_auth(client):
    """POST /z7k2m9/reports/{id}/approve returns 401 without Bearer token."""
    response = client.post("/z7k2m9/reports/550e8400-e29b-41d4-a716-446655440000/approve")
    assert response.status_code == 401


def test_admin_reject_requires_auth(client):
    """POST /z7k2m9/reports/{id}/reject returns 401 without Bearer token."""
    response = client.post("/z7k2m9/reports/550e8400-e29b-41d4-a716-446655440000/reject")
    assert response.status_code == 401


def test_admin_delete_requires_auth(client):
    """DELETE /z7k2m9/reports/{id} returns 401 without Bearer token."""
    response = client.delete("/z7k2m9/reports/550e8400-e29b-41d4-a716-446655440000")
    assert response.status_code == 401


def test_admin_reject_returns_200_and_updated_report(client):
    """POST /z7k2m9/reports/{id}/reject returns 200 and report with status rejected when authenticated."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    mock_table = MagicMock()
    pending_record = {"id": report_id, "slug": "abc", "country_origin": "US", "report_type": "website", "category": None,
                      "report_type_detail": None, "lost_money": False, "lost_money_range": None, "narrative": "x",
                      "consent_share_authorities": False, "created_at": "2025-01-15T12:00:00Z", "status": "pending",
                      "rating_count": 0, "sum_credibility": 0, "sum_usefulness": 0, "sum_completeness": 0, "sum_relevance": 0}
    rejected_record = {**pending_record, "status": "rejected"}
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
        MagicMock(data=[pending_record]),
        MagicMock(data=[rejected_record]),
    ]
    mock_table.update.return_value.eq.return_value.execute.return_value = MagicMock()
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_sb.return_value.table.return_value = mock_table
        response = client.post(
            f"/z7k2m9/reports/{report_id}/reject",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"


def test_admin_delete_returns_204(client):
    """DELETE /z7k2m9/reports/{id} returns 204 when authenticated and report exists."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{"id": report_id}]
    )
    mock_table.delete.return_value.eq.return_value.execute.return_value = MagicMock()
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_sb.return_value.table.return_value = mock_table
        response = client.delete(
            f"/z7k2m9/reports/{report_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 204


def test_admin_get_report_returns_200_with_full_report(client):
    """GET /z7k2m9/reports/{id} returns 200 and full report when authenticated."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    record = {
        "id": report_id, "slug": "abc", "country_origin": "US", "report_type": "website",
        "category": None, "report_type_detail": "https://evil.com", "lost_money": True,
        "lost_money_range": "under_100", "narrative": "Full narrative here.",
        "consent_share_authorities": True, "created_at": "2025-01-15T12:00:00Z", "status": "pending",
        "rating_count": 0, "sum_credibility": 0, "sum_usefulness": 0, "sum_completeness": 0, "sum_relevance": 0,
    }
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[record]
    )
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_sb.return_value.table.return_value = mock_table
        response = client.get(
            f"/z7k2m9/reports/{report_id}",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == report_id
    assert data["narrative"] == "Full narrative here."
    assert data["report_type_detail"] == "https://evil.com"
    assert data["status"] == "pending"


def test_admin_patch_report_returns_200_updated(client):
    """PATCH /z7k2m9/reports/{id} returns 200 and updated report when authenticated."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    record = {
        "id": report_id, "slug": "abc", "country_origin": "US", "report_type": "website",
        "category": None, "report_type_detail": None, "lost_money": False, "lost_money_range": None,
        "narrative": "Original", "consent_share_authorities": False, "created_at": "2025-01-15T12:00:00Z",
        "status": "pending", "rating_count": 0, "sum_credibility": 0, "sum_usefulness": 0,
        "sum_completeness": 0, "sum_relevance": 0,
    }
    updated_record = {**record, "narrative": "Updated narrative", "status": "approved"}
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
        MagicMock(data=[record]),
        MagicMock(data=[updated_record]),
    ]
    mock_table.update.return_value.eq.return_value.execute.return_value = MagicMock()
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_sb.return_value.table.return_value = mock_table
        response = client.patch(
            f"/z7k2m9/reports/{report_id}",
            json={"narrative": "Updated narrative", "status": "approved"},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["narrative"] == "Updated narrative"
    assert data["status"] == "approved"


def test_admin_patch_report_does_not_accept_consent(client):
    """PATCH with consent_share_authorities in body must not update consent — only submitter sets it."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    record = {
        "id": report_id, "slug": "abc", "country_origin": "US", "report_type": "website",
        "category": None, "report_type_detail": None, "lost_money": False, "lost_money_range": None,
        "narrative": "Original", "consent_share_authorities": False, "created_at": "2025-01-15T12:00:00Z",
        "status": "pending", "rating_count": 0, "sum_credibility": 0, "sum_usefulness": 0,
        "sum_completeness": 0, "sum_relevance": 0,
    }
    updated_record = {**record, "narrative": "Updated", "consent_share_authorities": False}
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
        MagicMock(data=[record]),
        MagicMock(data=[updated_record]),
    ]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_sb.return_value.table.return_value = mock_table
        response = client.patch(
            f"/z7k2m9/reports/{report_id}",
            json={"narrative": "Updated", "consent_share_authorities": True},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    call_args = mock_table.update.call_args
    assert call_args is not None
    passed_updates = call_args[0][0]
    assert "consent_share_authorities" not in passed_updates
    assert passed_updates.get("narrative") == "Updated"


def test_admin_settings_requires_auth(client):
    """GET /z7k2m9/settings returns 401 without Bearer token."""
    response = client.get("/z7k2m9/settings")
    assert response.status_code == 401


def test_admin_settings_get_returns_200_with_settings(client):
    """GET /z7k2m9/settings returns 200 with show_facebook_consent and show_report_scam when authenticated."""
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_table = MagicMock()
        mock_table.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
            MagicMock(data=[{"value": True}]),
            MagicMock(data=[{"value": False}]),
        ]
        mock_sb.return_value.table.return_value = mock_table
        response = client.get(
            "/z7k2m9/settings",
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert "show_facebook_consent" in data
    assert "show_report_scam" in data
    assert data["show_facebook_consent"] is True
    assert data["show_report_scam"] is False


def test_admin_settings_patch_requires_auth(client):
    """PATCH /z7k2m9/settings returns 401 without Bearer token."""
    response = client.patch("/z7k2m9/settings", json={"show_report_scam": False})
    assert response.status_code == 401


def test_admin_settings_patch_returns_200_and_updated_settings(client):
    """PATCH /z7k2m9/settings returns 200 and updated settings when authenticated."""
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_table = MagicMock()
        mock_table.upsert.return_value.execute.return_value = MagicMock()
        mock_table.select.return_value.eq.return_value.limit.return_value.execute.side_effect = [
            MagicMock(data=[{"value": True}]),
            MagicMock(data=[{"value": False}]),
            MagicMock(data=[{"value": True}]),
            MagicMock(data=[{"value": False}]),
        ]
        mock_sb.return_value.table.return_value = mock_table
        response = client.patch(
            "/z7k2m9/settings",
            json={"show_report_scam": False},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["show_report_scam"] is False


def test_admin_settings_patch_invalidates_config_cache(client):
    """PATCH /z7k2m9/settings calls invalidate_config_cached so GET /config refetches from DB."""
    from app.cache import set_config_cached, get_config_cached
    set_config_cached({"show_facebook_consent": True, "show_report_scam": True})
    assert get_config_cached() is not None
    login = client.post("/z7k2m9/login", json={"username": ADMIN_USER, "password": ADMIN_PASS})
    token = login.json()["access_token"]
    with patch("app.routers.admin.get_supabase") as mock_sb:
        mock_table = MagicMock()
        mock_table.upsert.return_value.execute.return_value = MagicMock()
        mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
            data=[{"value": False}]
        )
        mock_sb.return_value.table.return_value = mock_table
        client.patch(
            "/z7k2m9/settings",
            json={"show_facebook_consent": False},
            headers={"Authorization": f"Bearer {token}"},
        )
    assert get_config_cached() is None
