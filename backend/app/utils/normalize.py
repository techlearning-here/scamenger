"""Normalize report_type_detail for similarity matching (same URL/number)."""
import re
from typing import Optional


URL_LIKE_TYPES = frozenset({"website", "social_media", "whatsapp", "telegram", "discord"})


def normalize_report_type_detail(report_type: str, detail: Optional[str]) -> Optional[str]:
    """
    Return a normalized string for matching reports with the same identifier.
    - phone: digits only
    - URL-like types: lowercase, no protocol, no www, no trailing slash
    - else: lowercase trim
    """
    if not detail or not detail.strip():
        return None
    s = detail.strip()
    if report_type == "phone":
        return re.sub(r"\D", "", s) or None
    if report_type in URL_LIKE_TYPES and re.match(r"^https?://", s, re.I):
        s = re.sub(r"^https?://", "", s, flags=re.I)
        s = re.sub(r"^www\.", "", s, flags=re.I)
        s = s.rstrip("/")
        return s.lower() if s else None
    return s.lower()
