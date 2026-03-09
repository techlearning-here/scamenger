"""Unit tests for report LRU cache (TDD: test cache behavior in isolation)."""
import pytest

from app.cache import get_report_cached, set_report_cached, invalidate_report_cached


def test_get_report_cached_returns_none_when_empty():
    """get_report_cached returns None when report_id was never set."""
    assert get_report_cached("nonexistent-id-12345") is None


def test_set_and_get_report_cached_roundtrip():
    """set_report_cached stores a record; get_report_cached returns it."""
    report_id = "a1b2c3d4-e5f6-7890-abcd-ef1111111111"
    record = {
        "id": report_id,
        "slug": "abc123",
        "country_origin": "US",
        "report_type": "website",
        "created_at": "2025-01-15T12:00:00Z",
    }
    set_report_cached(report_id, record)
    assert get_report_cached(report_id) == record


def test_get_report_cached_returns_same_object_reference():
    """Cached value is the same dict reference (no copy)."""
    report_id = "cache-ref-test-id"
    record = {"id": report_id, "name": "test"}
    set_report_cached(report_id, record)
    retrieved = get_report_cached(report_id)
    assert retrieved is record


def test_invalidate_report_cached_removes_entry():
    """invalidate_report_cached removes the report; get then returns None."""
    report_id = "invalidate-test-id"
    record = {"id": report_id}
    set_report_cached(report_id, record)
    assert get_report_cached(report_id) is not None
    invalidate_report_cached(report_id)
    assert get_report_cached(report_id) is None


def test_invalidate_report_cached_idempotent_for_unknown_id():
    """invalidate_report_cached does nothing when id not in cache (no error)."""
    invalidate_report_cached("never-set-id-999")


def test_set_report_cached_overwrites_existing():
    """set_report_cached overwrites previous value for same report_id."""
    report_id = "overwrite-test-id"
    set_report_cached(report_id, {"v": 1})
    set_report_cached(report_id, {"v": 2})
    assert get_report_cached(report_id) == {"v": 2}
