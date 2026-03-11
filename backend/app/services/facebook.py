"""Post anonymized report summary to the Scam Avenger Facebook Page via Meta Graph API."""
import logging
from typing import Any

import httpx

from app.core.config import FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID, FACEBOOK_POSTING_ENABLED

GRAPH_API_BASE = "https://graph.facebook.com/v21.0"
logger = logging.getLogger(__name__)


def post_to_facebook_page(message: str) -> dict[str, Any]:
    """
    Post a message to the configured Facebook Page feed.
    Returns {"id": "page_id_post_id", "permalink": "https://..."} on success.
    Raises ValueError if posting is disabled or message is empty.
    Raises httpx.HTTPStatusError or returns error dict from Graph API on failure.
    """
    if not FACEBOOK_POSTING_ENABLED:
        raise ValueError("Facebook posting is not configured (set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN)")
    message = (message or "").strip()
    if not message:
        raise ValueError("Message cannot be empty")

    url = f"{GRAPH_API_BASE}/{FACEBOOK_PAGE_ID}/feed"
    payload = {"message": message, "access_token": FACEBOOK_PAGE_ACCESS_TOKEN}

    with httpx.Client(timeout=30.0) as client:
        response = client.post(url, json=payload)
        data = response.json() if response.content else {}

    if response.status_code != 200:
        error_msg = data.get("error", {}).get("message", response.text or "Unknown error")
        logger.warning("Facebook Graph API error: %s", error_msg)
        raise httpx.HTTPStatusError(
            f"Facebook API error: {error_msg}",
            request=response.request,
            response=response,
        )

    post_id = data.get("id", "")
    permalink = ""
    if post_id and "_" in post_id:
        page_id, pid = post_id.split("_", 1)
        permalink = f"https://www.facebook.com/{page_id}/posts/{pid}"
    return {"id": post_id, "permalink": permalink}
