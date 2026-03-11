"""Verify Supabase JWT and return user id for authenticated requests."""
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from app.core.config import SUPABASE_URL

JWKS_URL = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"
ISSUER = f"{SUPABASE_URL.rstrip('/')}/auth/v1"

_security = HTTPBearer(auto_error=False)
_jwks_client: PyJWKClient | None = None


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(JWKS_URL)
    return _jwks_client


def get_current_user_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_security)],
) -> str:
    """Verify Supabase JWT and return the user id (sub). Raises 401 if missing or invalid."""
    if not SUPABASE_URL:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth not configured",
        )
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
        )
    token = credentials.credentials
    try:
        client = _get_jwks_client()
        signing_key = client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "ES256"],
            issuer=ISSUER,
            audience="authenticated",
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing sub",
            )
        return str(user_id)
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from e


def get_current_user_id_optional(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_security)],
) -> Optional[str]:
    """Return user id if valid Bearer token present, else None. Never raises."""
    if not SUPABASE_URL or not credentials or not credentials.credentials:
        return None
    token = credentials.credentials
    try:
        client = _get_jwks_client()
        signing_key = client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "ES256"],
            issuer=ISSUER,
            audience="authenticated",
        )
        user_id = payload.get("sub")
        return str(user_id) if user_id else None
    except jwt.PyJWTError:
        return None
