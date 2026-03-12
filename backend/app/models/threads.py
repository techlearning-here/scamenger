"""Pydantic models for Threads posting (admin)."""
from typing import Optional

from pydantic import BaseModel, Field


class ThreadsStatusResponse(BaseModel):
    """Whether Threads posting is configured (admin)."""

    enabled: bool


class ThreadsPostRequest(BaseModel):
    """Optional body for POST /reports/{report_id}/post-to-threads. If message is omitted, backend builds anonymized summary."""

    message: Optional[str] = Field(None, max_length=2000)


class ThreadsPostResponse(BaseModel):
    """Response after successfully posting to Threads."""

    post_id: str
    permalink: str
