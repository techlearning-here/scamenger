"""
In-memory rate limiting by client IP for public endpoints (e.g. POST /contact, POST /reports).
Uses a sliding window: limit requests per window_seconds per identifier.
"""
import threading
import time
from collections import deque
from typing import Deque

from fastapi import Request
from starlette.exceptions import HTTPException

# Scope -> (identifier -> deque of timestamps)
_windows: dict[str, dict[str, Deque[float]]] = {}
_lock = threading.Lock()

# Limits: (max_requests, window_seconds)
CONTACT_LIMIT = (5, 60)   # 5 per minute
REPORTS_LIMIT = (10, 60)  # 10 per minute


def get_client_identifier(request: Request) -> str:
    """Return a stable identifier for the client (IP). Uses X-Forwarded-For when behind a proxy."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # First IP in the list is the client when behind a single proxy (e.g. Render)
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def _check(scope: str, identifier: str, limit: int, window_seconds: float) -> None:
    now = time.monotonic()
    with _lock:
        if scope not in _windows:
            _windows[scope] = {}
        if identifier not in _windows[scope]:
            _windows[scope][identifier] = deque()
        q = _windows[scope][identifier]
        cutoff = now - window_seconds
        while q and q[0] < cutoff:
            q.popleft()
        if len(q) >= limit:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={"Retry-After": str(int(window_seconds))},
            )
        q.append(now)


def rate_limit_contact(request: Request) -> None:
    """Dependency: enforce rate limit for POST /contact. Raises 429 if over limit."""
    limit, window = CONTACT_LIMIT
    _check("contact", get_client_identifier(request), limit, float(window))


def rate_limit_reports(request: Request) -> None:
    """Dependency: enforce rate limit for POST /reports. Raises 429 if over limit."""
    limit, window = REPORTS_LIMIT
    _check("reports", get_client_identifier(request), limit, float(window))
