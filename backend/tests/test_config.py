"""Tests for public config endpoint GET /config."""
import pytest

from app.cache import get_config_cached, set_config_cached, invalidate_config_cached


def test_get_config_returns_200_with_expected_keys(client):
    """GET /config returns 200 and includes show_facebook_consent and show_report_scam."""
    invalidate_config_cached()
    response = client.get("/config")
    assert response.status_code == 200
    data = response.json()
    assert "show_facebook_consent" in data
    assert "show_report_scam" in data
    assert isinstance(data["show_facebook_consent"], bool)
    assert isinstance(data["show_report_scam"], bool)


def test_get_config_returns_cached_value_when_cache_set(client):
    """GET /config returns cached config when cache is populated."""
    payload = {"show_facebook_consent": False, "show_report_scam": True}
    set_config_cached(payload)
    response = client.get("/config")
    assert response.status_code == 200
    assert response.json() == payload
