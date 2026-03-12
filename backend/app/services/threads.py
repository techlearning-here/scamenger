"""Post anonymized report summary to the Scam Avenger Threads account via Meta Threads API."""
import logging
from typing import Any

import httpx

from app.core.config import THREADS_ACCESS_TOKEN, THREADS_POSTING_ENABLED, THREADS_USER_ID

GRAPH_API_BASE = "https://graph.facebook.com/v21.0"
THREADS_MAX_TEXT_LENGTH = 500
logger = logging.getLogger(__name__)


def post_to_threads(text: str) -> dict[str, Any]:
    """
    Post a text-only thread to the configured Threads account.
    Uses Threads API with media_type=TEXT and auto_publish_text=true.
    Returns {"id": "...", "permalink": "..."} on success.
    Raises ValueError if posting is disabled or text is empty.
    Raises httpx.HTTPStatusError or returns error from API on failure.
    """
    if not THREADS_POSTING_ENABLED:
        raise ValueError(
            "Threads posting is not configured (set THREADS_USER_ID and THREADS_ACCESS_TOKEN)"
        )
    text = (text or "").strip()
    if not text:
        raise ValueError("Text cannot be empty")
    if len(text) > THREADS_MAX_TEXT_LENGTH:
        text = text[: THREADS_MAX_TEXT_LENGTH - 3] + "..."

    url = f"{GRAPH_API_BASE}/{THREADS_USER_ID}/threads"
    payload = {
        "media_type": "TEXT",
        "text": text,
        "auto_publish_text": True,
        "access_token": THREADS_ACCESS_TOKEN,
    }

    with httpx.Client(timeout=30.0) as client:
        response = client.post(url, data=payload)
        data = response.json() if response.content else {}

    if response.status_code != 200:
        error_msg = data.get("error", {}).get("message", response.text or "Unknown error")
        logger.warning("Threads API error: %s", error_msg)
        raise httpx.HTTPStatusError(
            f"Threads API error: {error_msg}",
            request=response.request,
            response=response,
        )

    post_id = data.get("id", "")
    permalink = data.get("permalink_url", "") or f"https://www.threads.net/@{THREADS_USER_ID}"
    return {"id": post_id, "permalink": permalink}
