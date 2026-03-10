"""Pydantic models for site settings (admin)."""
from typing import Optional

from pydantic import BaseModel


class SiteSettingsResponse(BaseModel):
    """Current site settings (admin read)."""

    show_facebook_consent: bool = True
    show_report_scam: bool = True


class SiteSettingsUpdate(BaseModel):
    """Payload to update site settings (admin). Only provided fields are updated."""

    show_facebook_consent: Optional[bool] = None
    show_report_scam: Optional[bool] = None
