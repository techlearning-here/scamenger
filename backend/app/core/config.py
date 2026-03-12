"""App configuration from environment."""
import os

import app.core.env  # noqa: F401 - load .env before reading

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

# Use service role for backend (full access); anon for public endpoints if needed
SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY
SUPABASE_CONFIGURED = bool(SUPABASE_URL and SUPABASE_KEY)

# Admin: set via environment variables (required for admin login).
# Use strong values; UUIDs are fine for username/password. ADMIN_SECRET must be at least 32 chars for JWT.
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "").strip()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "").strip()

# Facebook: optional. When set, admin can post approved report summaries to the Scam Avenger Facebook Page.
FACEBOOK_PAGE_ID = os.environ.get("FACEBOOK_PAGE_ID", "").strip()
FACEBOOK_PAGE_ACCESS_TOKEN = os.environ.get("FACEBOOK_PAGE_ACCESS_TOKEN", "").strip()
FACEBOOK_POSTING_ENABLED = bool(FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN)

# Threads (Meta): optional. When set, admin can post approved report summaries to the Scam Avenger Threads account.
THREADS_USER_ID = os.environ.get("THREADS_USER_ID", "").strip()
THREADS_ACCESS_TOKEN = os.environ.get("THREADS_ACCESS_TOKEN", "").strip()
THREADS_POSTING_ENABLED = bool(THREADS_USER_ID and THREADS_ACCESS_TOKEN)

# Optional: 32-byte key (base64-encoded) for symmetric decryption of login password. When set, login accepts password_encrypted.
ENCRYPTION_KEY_B64 = (os.environ.get("ENCRYPTION_KEY", "") or "").strip()
