"""Pydantic models for scam reports API."""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

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
    consent_share_social: bool = False
    external_evidence_links: Optional[list[str]] = None

    @field_validator("external_evidence_links", mode="before")
    @classmethod
    def validate_evidence_links(cls, v: object) -> list[str]:
        if v is None:
            return []
        if not isinstance(v, list):
            return []
        out = []
        for i, item in enumerate(v[:5]):
            if item is None or not str(item).strip():
                continue
            s = str(item).strip()
            if len(s) > 2048:
                raise ValueError(f"External evidence link {i + 1} must be at most 2048 characters")
            out.append(s)
        return out


class RatePayload(BaseModel):
    """Payload to rate a report (authenticated). All scores 1-5."""

    credibility: int = Field(..., ge=1, le=5)
    usefulness: int = Field(..., ge=1, le=5)
    completeness: int = Field(..., ge=1, le=5)
    relevance: int = Field(..., ge=1, le=5)


class HelpfulVotePayload(BaseModel):
    """Payload for "Did this help?" vote (authenticated)."""

    helpful: bool


class HelpfulCountsResponse(BaseModel):
    """Response for GET/POST report helpful: counts and optional current user vote."""

    helpful_count: int = 0
    not_helpful_count: int = 0
    user_vote: Optional[bool] = None  # True = Yes, False = No, None = not voted / not auth


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
    consent_share_social: bool = False
    created_at: datetime
    rating_count: int = 0
    avg_credibility: float = 0.0
    avg_usefulness: float = 0.0
    avg_completeness: float = 0.0
    avg_relevance: float = 0.0
    status: Optional[Literal["pending", "approved"]] = None
    message: Optional[str] = None
    submitter_view_token: Optional[str] = None
    # Number of other approved reports with same report_type_detail (URL/number). None if not applicable.
    similar_count: Optional[int] = None
    # Present when GET is authenticated and user has rated; allows pre-fill and update.
    user_rating: Optional[RatePayload] = None
    # Optional list of up to 5 external evidence URLs submitted with the report.
    external_evidence_links: list[str] = []


ReportStatus = Literal["pending", "approved", "rejected"]


class ReportPendingResponse(BaseModel):
    """Returned when report exists but is not yet approved. No report content exposed."""

    status: Literal["pending"] = "pending"
    message: str = "This report is waiting for approval. It may take up to 48 hours."
    id: Optional[str] = None


class AdminReportResponse(ReportResponse):
    """Report with status for admin list."""

    status: ReportStatus
    facebook_post_id: Optional[str] = None
    facebook_posted_at: Optional[datetime] = None
    facebook_permalink: Optional[str] = None


class AdminReportUpdate(BaseModel):
    """Payload to update a report (admin). All fields optional. Consent flags are not included — only the submitter can set them; admins cannot change consent."""

    country_origin: Optional[str] = Field(None, min_length=1, max_length=255)
    report_type: Optional[ReportType] = None
    report_type_detail: Optional[str] = Field(None, max_length=2000)
    category: Optional[str] = Field(None, max_length=100)
    lost_money: Optional[bool] = None
    lost_money_range: Optional[LostMoneyRange] = None
    narrative: Optional[str] = Field(None, max_length=3_000)
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
