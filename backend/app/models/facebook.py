"""Pydantic models for Facebook posting (admin)."""
from typing import Optional

from pydantic import BaseModel, Field


class FacebookStatusResponse(BaseModel):
    """Whether Facebook posting is configured (admin)."""

    enabled: bool


class FacebookPostRequest(BaseModel):
    """Optional body for POST /reports/{report_id}/post-to-facebook. If message is omitted, backend builds anonymized summary."""

    message: Optional[str] = Field(None, max_length=63_206)


class FacebookPostResponse(BaseModel):
    """Response after successfully posting to Facebook Page."""

    post_id: str
    permalink: str
