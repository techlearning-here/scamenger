"""Pydantic models for scam reports API."""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

ReportType = Literal[
    "website",
    "phone",
    "crypto",
    "iban",
    "social_media",
    "whatsapp",
    "telegram",
    "discord",
    "other",
]

LostMoneyRange = Literal[
    "none",
    "under_100",
    "under_1000",
    "under_10000",
    "under_100000",
    "under_1000000",
    "over_1000000",
]


class ReportCreate(BaseModel):
    """Payload to create a new scam report (anonymous)."""

    country_origin: str = Field(..., min_length=1, max_length=255)
    report_type: ReportType
    report_type_detail: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    lost_money: bool = False
    lost_money_range: Optional[LostMoneyRange] = None
    narrative: str = Field(..., min_length=1, max_length=3_000)
    consent_share_authorities: bool = False


class RatePayload(BaseModel):
    """Payload to rate a report (authenticated). All scores 1-5."""

    credibility: int = Field(..., ge=1, le=5)
    usefulness: int = Field(..., ge=1, le=5)
    completeness: int = Field(..., ge=1, le=5)
    relevance: int = Field(..., ge=1, le=5)


class ReportResponse(BaseModel):
    """Single report as returned by GET /reports/{report_id} or after POST."""

    model_config = ConfigDict(from_attributes=True)

    id: str
    slug: str
    country_origin: str
    report_type: str
    category: Optional[str]
    report_type_detail: Optional[str] = None
    lost_money: bool
    lost_money_range: Optional[str] = None
    narrative: Optional[str]
    consent_share_authorities: bool
    created_at: datetime
    rating_count: int = 0
    avg_credibility: float = 0.0
    avg_usefulness: float = 0.0
    avg_completeness: float = 0.0
    avg_relevance: float = 0.0
    status: Optional[Literal["pending", "approved"]] = None
    message: Optional[str] = None
    submitter_view_token: Optional[str] = None


ReportStatus = Literal["pending", "approved", "rejected"]


class ReportPendingResponse(BaseModel):
    """Returned when report exists but is not yet approved. No report content exposed."""

    status: Literal["pending"] = "pending"
    message: str = "This report is waiting for approval. It may take up to 48 hours."
    id: Optional[str] = None


class AdminReportResponse(ReportResponse):
    """Report with status for admin list."""

    status: ReportStatus


class AdminReportUpdate(BaseModel):
    """Payload to update a report (admin). All fields optional."""

    country_origin: Optional[str] = Field(None, min_length=1, max_length=255)
    report_type: Optional[ReportType] = None
    report_type_detail: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    lost_money: Optional[bool] = None
    lost_money_range: Optional[LostMoneyRange] = None
    narrative: Optional[str] = Field(None, max_length=3_000)
    consent_share_authorities: Optional[bool] = None
    status: Optional[ReportStatus] = None


class AdminReportsListResponse(BaseModel):
    """Paginated list of reports for admin."""

    items: list[AdminReportResponse]
    total: int
    page: int
    page_size: int


class AdminApprovedStatsCategory(BaseModel):
    """Count of approved reports for one category."""

    category: Optional[str] = None  # None = no category / uncategorized
    count: int


class AdminApprovedStatsResponse(BaseModel):
    """Total approved reports and count by scam category. Admin only."""

    total_approved: int
    by_category: list[AdminApprovedStatsCategory]
