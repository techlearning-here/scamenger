"""Tests for report-scam API (GET/POST /reports)."""
import pytest
from unittest.mock import patch, MagicMock


@pytest.fixture
def mock_supabase():
    """Provide a mock Supabase client when Supabase is not configured."""
    with patch("app.routers.reports.get_supabase") as m:
        yield m


def test_get_report_returns_from_cache_when_hit(client, mock_supabase):
    """GET /reports/{report_id} returns 200 from cache without calling Supabase."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    cached_record = {
        "id": report_id,
        "slug": "cachedslug",
        "country_origin": "GB",
        "report_type": "phone",
        "category": None,
        "lost_money": False,
        "narrative": "Cached narrative.",
        "consent_share_authorities": True,
        "created_at": "2025-02-01T10:00:00Z",
        "status": "approved",
    }
    with patch("app.routers.reports.get_report_cached", return_value=cached_record):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == report_id
    assert data["slug"] == "cachedslug"
    assert data["country_origin"] == "GB"
    assert data["narrative"] == "Cached narrative."
    mock_supabase.assert_not_called()


def test_get_report_returns_200_pending_when_not_approved(client, mock_supabase):
    """GET /reports/{report_id} returns 200 with pending message when report exists but status is pending."""
    report_id = "550e8400-e29b-41d4-a716-446655440002"
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{
            "id": report_id,
            "slug": "pending123",
            "country_origin": "US",
            "report_type": "website",
            "category": None,
            "lost_money": False,
            "narrative": "Pending.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
            "status": "pending",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert "approval" in data["message"].lower()
    assert "48" in data["message"]


def test_get_report_returns_full_pending_when_view_token_matches(client, mock_supabase):
    """GET /reports/{report_id}?view_token=XXX returns 200 with full narrative and report_type_detail when pending and token matches."""
    report_id = "550e8400-e29b-41d4-a716-446655440002"
    view_token = "abc123token"
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{
            "id": report_id,
            "slug": "pending123",
            "country_origin": "US",
            "report_type": "website",
            "report_type_detail": "https://scam.example.com",
            "category": None,
            "lost_money": False,
            "narrative": "They asked for my password.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
            "status": "pending",
            "submitter_view_token": view_token,
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}?view_token={view_token}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert data["narrative"] == "They asked for my password."
    assert data["report_type_detail"] == "https://scam.example.com"


def test_get_report_returns_404_when_rejected(client, mock_supabase):
    """GET /reports/{report_id} returns 404 when report exists but status is rejected."""
    report_id = "550e8400-e29b-41d4-a716-446655440003"
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{
            "id": report_id,
            "slug": "rej123",
            "country_origin": "US",
            "report_type": "website",
            "category": None,
            "lost_money": False,
            "narrative": "Rejected.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
            "status": "rejected",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_report_returns_503_when_supabase_unavailable(client, mock_supabase):
    """GET /reports/{report_id} returns 503 when Supabase is not configured."""
    mock_supabase.return_value = None
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get("/reports/550e8400-e29b-41d4-a716-446655440000")
    assert response.status_code == 503
    assert "unavailable" in response.json()["detail"].lower()


def test_get_report_returns_404_when_not_found(client, mock_supabase):
    """GET /reports/{report_id} returns 404 when id does not exist."""
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get("/reports/550e8400-e29b-41d4-a716-446655440000")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_report_returns_200_with_report(client, mock_supabase):
    """GET /reports/{report_id} returns 200 and report when found."""
    report_id = "550e8400-e29b-41d4-a716-446655440000"
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{
            "id": report_id,
            "slug": "abc123def456",
            "country_origin": "US",
            "report_type": "website",
            "category": "phishing",
            "lost_money": True,
            "narrative": "They asked for my password.",
            "consent_share_authorities": True,
            "created_at": "2025-01-15T12:00:00Z",
            "status": "approved",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == report_id
    assert data["slug"] == "abc123def456"
    assert data["country_origin"] == "US"
    assert data["report_type"] == "website"
    assert data["lost_money"] is True
    # No report_type_detail so similar_count not queried; may be 0 or absent
    assert data.get("similar_count") in (0, None)


def test_get_report_includes_similar_count_when_others_exist(client, mock_supabase):
    """GET /reports/{id} returns similar_count when approved report has report_type_detail and other matches exist."""
    report_id = "550e8400-e29b-41d4-a716-446655440010"
    approved_record = {
        "id": report_id,
        "slug": "abc123",
        "country_origin": "US",
        "report_type": "phone",
        "report_type_detail": "+1 234 567 8900",
        "report_type_detail_normalized": "12345678900",
        "category": None,
        "lost_money": False,
        "narrative": "Scam call.",
        "consent_share_authorities": False,
        "created_at": "2025-01-15T12:00:00Z",
        "rating_count": 0,
        "sum_credibility": 0,
        "sum_usefulness": 0,
        "sum_completeness": 0,
        "sum_relevance": 0,
        "status": "approved",
    }
    mock_table = MagicMock()
    main_chain = MagicMock()
    main_chain.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[approved_record])
    similar_chain = MagicMock()
    similar_chain.eq.return_value.eq.return_value.eq.return_value.neq.return_value.execute.return_value = MagicMock(
        data=[{"id": "other-1"}, {"id": "other-2"}]
    )
    mock_table.select.side_effect = [main_chain, similar_chain]
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data.get("similar_count") == 2


def test_get_report_similar_count_zero_when_no_others(client, mock_supabase):
    """GET /reports/{id} returns similar_count 0 when no other reports match."""
    report_id = "550e8400-e29b-41d4-a716-446655440011"
    approved_record = {
        "id": report_id,
        "slug": "abc124",
        "country_origin": "US",
        "report_type": "website",
        "report_type_detail": "https://unique.com",
        "report_type_detail_normalized": "unique.com",
        "category": None,
        "lost_money": False,
        "narrative": "Only report.",
        "consent_share_authorities": False,
        "created_at": "2025-01-15T12:00:00Z",
        "rating_count": 0,
        "sum_credibility": 0,
        "sum_usefulness": 0,
        "sum_completeness": 0,
        "sum_relevance": 0,
        "status": "approved",
    }
    mock_table = MagicMock()
    main_chain = MagicMock()
    main_chain.eq.return_value.limit.return_value.execute.return_value = MagicMock(data=[approved_record])
    similar_chain = MagicMock()
    similar_chain.eq.return_value.eq.return_value.eq.return_value.neq.return_value.execute.return_value = MagicMock(data=[])
    mock_table.select.side_effect = [main_chain, similar_chain]
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data.get("similar_count") == 0


def test_get_report_from_cache_includes_similar_count(client, mock_supabase):
    """GET /reports/{id} from cache with report_type_detail includes similar_count when similar query returns matches."""
    report_id = "550e8400-e29b-41d4-a716-446655440013"
    cached_record = {
        "id": report_id,
        "slug": "cachedslug",
        "country_origin": "US",
        "report_type": "phone",
        "report_type_detail": "+1 555 123 4567",
        "report_type_detail_normalized": "15551234567",
        "category": None,
        "lost_money": False,
        "narrative": "Cached.",
        "consent_share_authorities": False,
        "created_at": "2025-02-01T10:00:00Z",
        "rating_count": 0,
        "sum_credibility": 0,
        "sum_usefulness": 0,
        "sum_completeness": 0,
        "sum_relevance": 0,
        "status": "approved",
    }
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.eq.return_value.eq.return_value.neq.return_value.execute.return_value = MagicMock(
        data=[{"id": "other-a"}]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=cached_record):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["similar_count"] == 1


def test_get_report_includes_rating_aggregates(client, mock_supabase):
    """GET /reports/{report_id} includes rating_count and avg_* when present."""
    report_id = "550e8400-e29b-41d4-a716-446655440001"
    mock_table = MagicMock()
    mock_table.select.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{
            "id": report_id,
            "slug": "abc123",
            "country_origin": "US",
            "report_type": "website",
            "category": None,
            "lost_money": False,
            "narrative": None,
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
            "rating_count": 2,
            "sum_credibility": 8,
            "sum_usefulness": 9,
            "sum_completeness": 7,
            "sum_relevance": 6,
            "status": "approved",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_table
    with patch("app.routers.reports.get_report_cached", return_value=None):
        response = client.get(f"/reports/{report_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["rating_count"] == 2
    assert data["avg_credibility"] == 4.0
    assert data["avg_usefulness"] == 4.5


def test_create_report_returns_503_when_supabase_unavailable(client, mock_supabase):
    """POST /reports returns 503 when Supabase is not configured."""
    mock_supabase.return_value = None
    response = client.post(
        "/reports",
        json={
            "country_origin": "US",
            "report_type": "website",
            "lost_money": False,
            "narrative": "Someone tried to phish me.",
        },
    )
    assert response.status_code == 503


def test_create_report_returns_201_and_report(client, mock_supabase):
    """POST /reports creates a report and returns 201 with id."""
    mock_insert = MagicMock()
    mock_insert.insert.return_value.execute.return_value = MagicMock(
        data=[{
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "slug": "a1b2c3d4e5f6",
            "country_origin": "US",
            "report_type": "phone",
            "category": None,
            "lost_money": True,
            "narrative": "Fake IRS call.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_insert
    response = client.post(
        "/reports",
        json={
            "country_origin": "US",
            "report_type": "phone",
            "category": "government",
            "lost_money": True,
            "narrative": "Fake IRS call.",
            "consent_share_authorities": False,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == "550e8400-e29b-41d4-a716-446655440000"
    assert data["slug"] == "a1b2c3d4e5f6"
    assert data["country_origin"] == "US"
    assert data["report_type"] == "phone"
    assert data["lost_money"] is True
    call_args = mock_insert.insert.call_args
    assert call_args is not None
    row = call_args[0][0]
    assert "report_type_detail_normalized" in row
    assert row["report_type_detail_normalized"] is None


def test_create_report_sends_normalized_phone(client, mock_supabase):
    """POST /reports with report_type=phone and report_type_detail sends digits-only normalized value."""
    mock_insert = MagicMock()
    mock_insert.insert.return_value.execute.return_value = MagicMock(
        data=[{
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "slug": "a1b2c3d4e5f7",
            "country_origin": "US",
            "report_type": "phone",
            "report_type_detail": "+1 234 567 8900",
            "lost_money": False,
            "narrative": "Scam call.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_insert
    response = client.post(
        "/reports",
        json={
            "country_origin": "US",
            "report_type": "phone",
            "report_type_detail": "+1 234 567 8900",
            "lost_money": False,
            "narrative": "Scam call.",
            "consent_share_authorities": False,
        },
    )
    assert response.status_code == 201
    call_args = mock_insert.insert.call_args
    row = call_args[0][0]
    assert row["report_type_detail_normalized"] == "12345678900"


def test_create_report_sends_normalized_website(client, mock_supabase):
    """POST /reports with report_type=website and URL sends normalized URL (lowercase, no protocol)."""
    mock_insert = MagicMock()
    mock_insert.insert.return_value.execute.return_value = MagicMock(
        data=[{
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "slug": "a1b2c3d4e5f8",
            "country_origin": "US",
            "report_type": "website",
            "report_type_detail": "https://Evil.COM/",
            "lost_money": False,
            "narrative": "Phishing site.",
            "consent_share_authorities": False,
            "created_at": "2025-01-15T12:00:00Z",
        }]
    )
    mock_supabase.return_value = MagicMock()
    mock_supabase.return_value.table.return_value = mock_insert
    response = client.post(
        "/reports",
        json={
            "country_origin": "US",
            "report_type": "website",
            "report_type_detail": "https://Evil.COM/",
            "lost_money": False,
            "narrative": "Phishing site.",
            "consent_share_authorities": False,
        },
    )
    assert response.status_code == 201
    call_args = mock_insert.insert.call_args
    row = call_args[0][0]
    assert row["report_type_detail_normalized"] == "evil.com"


def test_create_report_validates_country_origin_required(client, mock_supabase):
    """POST /reports returns 422 when country_origin is missing."""
    mock_supabase.return_value = MagicMock()
    response = client.post(
        "/reports",
        json={
            "report_type": "website",
        },
    )
    assert response.status_code == 422


def test_create_report_validates_report_type(client, mock_supabase):
    """POST /reports returns 422 when report_type is invalid."""
    mock_supabase.return_value = MagicMock()
    response = client.post(
        "/reports",
        json={
            "country_origin": "US",
            "report_type": "invalid_type",
        },
    )
    assert response.status_code == 422


def test_rate_report_returns_401_without_auth(client, mock_supabase):
    """POST /reports/{report_id}/rate returns 401 when no Bearer token."""
    mock_supabase.return_value = MagicMock()
    with patch("app.auth.deps.SUPABASE_URL", "https://example.supabase.co"):
        response = client.post(
            "/reports/550e8400-e29b-41d4-a716-446655440000/rate",
            json={"credibility": 4, "usefulness": 5, "completeness": 3, "relevance": 4},
        )
    assert response.status_code == 401
