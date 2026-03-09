"""Supabase client singleton. Use get_supabase() for database and auth."""
from typing import Optional

from supabase import Client, create_client

from app.core.config import SUPABASE_CONFIGURED, SUPABASE_KEY, SUPABASE_URL

_client: Optional[Client] = None


def get_supabase() -> Optional[Client]:
    """Return the Supabase client, or None if not configured."""
    global _client
    if not SUPABASE_CONFIGURED:
        return None
    if _client is None:
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client
