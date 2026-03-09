"""In-memory LRU cache for report rows to reduce database fetches."""
import threading
from typing import Any

from cachetools import LRUCache

# Max number of reports to keep. Oldest (least recently used) evicted when full.
REPORT_CACHE_MAXSIZE = 1000

_report_cache: LRUCache[str, dict[str, Any]] = LRUCache(maxsize=REPORT_CACHE_MAXSIZE)
_cache_lock = threading.Lock()


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
