"""Public config API (no auth). Used by report form to know e.g. whether to show Facebook consent."""
from typing import Any

from fastapi import APIRouter

from app.cache import get_config_cached, set_config_cached
from app.db.supabase import get_supabase

router = APIRouter(tags=["config"])


def _get_setting(key: str, default: Any) -> Any:
    """Read a single site_settings value. Returns default if missing or error."""
    sb = get_supabase()
    if not sb:
        return default
    try:
        result = sb.table("site_settings").select("value").eq("key", key).limit(1).execute()
        if result.data and len(result.data) > 0:
            return result.data[0].get("value", default)
    except Exception:
        pass
    return default


def _normalize_bool(val: Any, default: bool) -> bool:
    """Normalize a value from site_settings to bool."""
    if isinstance(val, bool):
        return val
    if isinstance(val, str) and val.lower() in ("true", "1", "yes"):
        return True
    if val is not None:
        return bool(val)
    return default


@router.get("/config")
def get_config() -> dict:
    """Public config for the frontend. Controls e.g. whether report form shows Facebook share consent, and whether Report a scam is enabled. Cached to avoid DB hit."""
    cached = get_config_cached()
    if cached is not None:
        return cached
    show_fb = _normalize_bool(_get_setting("show_facebook_consent", True), True)
    show_report = _normalize_bool(_get_setting("show_report_scam", True), True)
    result = {"show_facebook_consent": show_fb, "show_report_scam": show_report}
    set_config_cached(result)
    return result
