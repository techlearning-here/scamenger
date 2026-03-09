"""App configuration from environment."""
import os

import app.core.env  # noqa: F401 - load .env before reading

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

# Use service role for backend (full access); anon for public endpoints if needed
SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
SUPABASE_CONFIGURED = bool(SUPABASE_URL and SUPABASE_KEY)

# Admin (UUID as username, UUID as password; set in env or use these defaults)
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "11111111-1111-4111-a111-111111111111")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "22222222-2222-4222-a222-222222222222")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "dev-secret-change-in-production")
