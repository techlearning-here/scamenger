"""Unit tests for report_type_detail normalization (similarity matching)."""
import pytest
from app.utils.normalize import normalize_report_type_detail


def test_normalize_phone_digits_only():
    """Phone: only digits are kept."""
    assert normalize_report_type_detail("phone", "+1 234 567 8900") == "12345678900"
    assert normalize_report_type_detail("phone", "(234) 567-8900") == "2345678900"
    assert normalize_report_type_detail("phone", "2345678900") == "2345678900"
    assert normalize_report_type_detail("phone", " 44 20 7123 4567 ") == "442071234567"


def test_normalize_phone_empty_or_none():
    """Phone: None or empty returns None."""
    assert normalize_report_type_detail("phone", None) is None
    assert normalize_report_type_detail("phone", "") is None
    assert normalize_report_type_detail("phone", "   ") is None


def test_normalize_website_lowercase_no_protocol():
    """Website/URL: lowercase, no protocol, no www, no trailing slash."""
    assert normalize_report_type_detail("website", "https://Example.COM/") == "example.com"
    assert normalize_report_type_detail("website", "HTTP://www.evil.com/path/") == "evil.com/path"
    assert normalize_report_type_detail("website", "https://www.scam.site/") == "scam.site"


def test_normalize_social_media_url():
    """URL-like types (social_media, etc.) use same URL normalization."""
    assert normalize_report_type_detail("social_media", "https://facebook.com/fake") == "facebook.com/fake"
    assert normalize_report_type_detail("whatsapp", "https://wa.me/123") == "wa.me/123"


def test_normalize_other_lowercase_trim():
    """Other types: lowercase and trim."""
    assert normalize_report_type_detail("crypto", " 0xAbC123 ") == "0xabc123"
    assert normalize_report_type_detail("iban", "GB82WEST12345698765432") == "gb82west12345698765432"
    assert normalize_report_type_detail("other", " Some Detail ") == "some detail"


def test_normalize_empty_detail_returns_none():
    """Any type with empty detail returns None."""
    assert normalize_report_type_detail("website", "") is None
    assert normalize_report_type_detail("phone", None) is None
    assert normalize_report_type_detail("crypto", "  ") is None
