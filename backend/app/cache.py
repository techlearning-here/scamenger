"""In-memory LRU cache for report rows to reduce database fetches."""
import threading
import time
from typing import Any

from cachetools import LRUCache

# Max number of reports to keep. Oldest (least recently used) evicted when full.
REPORT_CACHE_MAXSIZE = 1000

_report_cache: LRUCache[str, dict[str, Any]] = LRUCache(maxsize=REPORT_CACHE_MAXSIZE)
_cache_lock = threading.Lock()

# Public config cache (GET /config) to avoid DB hit on every request.
CONFIG_CACHE_TTL_SECONDS = 60
_config_cache: dict[str, Any] | None = None
_config_cache_expires_at: float = 0.0
_config_lock = threading.Lock()


def get_report_cached(report_id: str) -> dict[str, Any] | None:
    """Return cached report row if present, else None. Thread-safe."""
    with _cache_lock:
        return _report_cache.get(report_id)


def set_report_cached(report_id: str, record: dict[str, Any]) -> None:
    """Store a report row in the cache. Thread-safe."""
    with _cache_lock:
        _report_cache[report_id] = record


def invalidate_report_cached(report_id: str) -> None:
    """Remove a report from the cache (e.g. after rating update). Thread-safe."""
    with _cache_lock:
        _report_cache.pop(report_id, None)


def get_config_cached() -> dict[str, Any] | None:
    """Return cached public config if present and not expired. Thread-safe."""
    with _config_lock:
        if _config_cache is not None and time.monotonic() < _config_cache_expires_at:
            return _config_cache
    return None


def set_config_cached(data: dict[str, Any]) -> None:
    """Store public config in the cache. Thread-safe."""
    global _config_cache, _config_cache_expires_at
    with _config_lock:
        _config_cache = dict(data)
        _config_cache_expires_at = time.monotonic() + CONFIG_CACHE_TTL_SECONDS


def invalidate_config_cached() -> None:
    """Clear config cache so next GET /config refetches from DB. Call after admin updates settings."""
    global _config_cache, _config_cache_expires_at
    with _config_lock:
        _config_cache = None
        _config_cache_expires_at = 0.0
