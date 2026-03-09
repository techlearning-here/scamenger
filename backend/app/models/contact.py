"""Pydantic models for contact form API."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ContactCreate(BaseModel):
    """Payload to submit contact form (public)."""

    name: str = Field(..., min_length=1, max_length=255)
    email: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1, max_length=10_000)


class ContactMessageResponse(BaseModel):
    """Single contact message (admin)."""

    id: str
    name: Optional[str]
    email: Optional[str]
    message: str
    read: bool
    created_at: datetime


class ContactMessagesListResponse(BaseModel):
    """Paginated list of contact messages (admin)."""

    items: list[ContactMessageResponse]
    total: int
    page: int
    page_size: int
