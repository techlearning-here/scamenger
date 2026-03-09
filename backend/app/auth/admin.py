"""Admin authentication: hardcoded credentials, JWT for session."""
import time
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import ADMIN_PASSWORD, ADMIN_SECRET, ADMIN_USERNAME

ALGORITHM = "HS256"
TOKEN_EXPIRY_SECONDS = 86400  # 24 hours

_security = HTTPBearer(auto_error=False)


class AdminLoginPayload(BaseModel):
    """Login request body."""

    username: str
    password: str


class AdminTokenResponse(BaseModel):
    """Login success response."""

    access_token: str
    token_type: str = "bearer"


def create_admin_token(username: str) -> str:
    """Create a JWT for the admin user."""
    payload = {
        "sub": username,
        "role": "admin",
        "exp": int(time.time()) + TOKEN_EXPIRY_SECONDS,
    }
    raw = jwt.encode(payload, ADMIN_SECRET, algorithm=ALGORITHM)
    return raw if isinstance(raw, str) else raw.decode("utf-8")


def verify_admin_credentials(username: str, password: str) -> bool:
    """Return True if username and password match configured admin."""
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def get_admin_from_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_security)],
) -> str:
    """Verify admin JWT and return username. Raises 401 if missing or invalid."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization",
        )
    try:
        payload = jwt.decode(
            credentials.credentials,
            ADMIN_SECRET,
            algorithms=[ALGORITHM],
        )
        if payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        sub = payload.get("sub")
        if not sub or sub != ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return str(sub)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        ) from None
