"""Report-scam API: create and retrieve reports."""
import logging
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.auth.deps import get_current_user_id
from app.cache import get_report_cached, set_report_cached
from app.db.supabase import get_supabase
from app.models.report import RatePayload, ReportCreate, ReportPendingResponse, ReportResponse
from app.rate_limit import rate_limit_reports

router = APIRouter(prefix="/reports", tags=["reports"])
logger = logging.getLogger(__name__)


def _generate_slug() -> str:
    """Return a short unique slug for shareable URLs."""
    return uuid.uuid4().hex[:12]


def _report_from_record(
    record: dict[str, Any],
    *,
    status: Optional[str] = None,
    message: Optional[str] = None,
    submitter_view_token: Optional[str] = None,
    mask_sensitive: bool = False,
) -> ReportResponse:
    """Build ReportResponse from a reports row (with optional rating columns)."""
    rating_count = record.get("rating_count") or 0
    if rating_count > 0:
        avg_credibility = (record.get("sum_credibility") or 0) / rating_count
        avg_usefulness = (record.get("sum_usefulness") or 0) / rating_count
        avg_completeness = (record.get("sum_completeness") or 0) / rating_count
        avg_relevance = (record.get("sum_relevance") or 0) / rating_count
    else:
        avg_credibility = avg_usefulness = avg_completeness = avg_relevance = 0.0
    narrative = None if mask_sensitive else record.get("narrative")
    report_type_detail = None if mask_sensitive else record.get("report_type_detail")
    return ReportResponse(
        id=str(record["id"]),
        slug=record["slug"],
        country_origin=record["country_origin"],
        report_type=record["report_type"],
        category=record.get("category"),
        report_type_detail=report_type_detail,
        lost_money=record["lost_money"],
        lost_money_range=record.get("lost_money_range"),
        narrative=narrative,
        consent_share_authorities=record["consent_share_authorities"],
        consent_share_social=record.get("consent_share_social", False),
        created_at=record["created_at"],
        rating_count=rating_count,
        avg_credibility=round(avg_credibility, 2),
        avg_usefulness=round(avg_usefulness, 2),
        avg_completeness=round(avg_completeness, 2),
        avg_relevance=round(avg_relevance, 2),
        status=status,
        message=message,
        submitter_view_token=submitter_view_token,
    )


@router.post("", response_model=ReportResponse, status_code=201)
def create_report(
    payload: ReportCreate,
    _: None = Depends(rate_limit_reports),
) -> ReportResponse:
    """Create a new scam report (no auth). Returns the report with shareable id (use in URL as ?id=)."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Reports service unavailable")
    slug = _generate_slug()
    view_token = uuid.uuid4().hex
    lost_money_range = getattr(payload, "lost_money_range", None)
    if lost_money_range and lost_money_range != "none":
        lost_money = True
        store_range = lost_money_range
    else:
        lost_money = payload.lost_money
        store_range = None
    row = {
        "slug": slug,
        "country_origin": payload.country_origin,
        "report_type": payload.report_type,
        "report_type_detail": payload.report_type_detail,
        "category": payload.category,
        "lost_money": lost_money,
        "lost_money_range": store_range,
        "narrative": payload.narrative,
        "consent_share_authorities": payload.consent_share_authorities,
        "consent_share_social": payload.consent_share_social,
        "status": "pending",
        "submitter_view_token": view_token,
    }
    try:
        result = sb.table("reports").insert(row).execute()
    except Exception as e:
        logger.exception("Supabase insert failed: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Reports service unavailable.",
        ) from e
    if not result.data or len(result.data) != 1:
        raise HTTPException(status_code=500, detail="Failed to create report")
    record = result.data[0]
    set_report_cached(str(record["id"]), record)
    return _report_from_record(
        record,
        status="pending",
        message="This report is waiting for approval. It may take up to 48 hours.",
        submitter_view_token=view_token,
    )


@router.get(
    "/{report_id}",
    response_model=ReportResponse | ReportPendingResponse,
)
def get_report(
    report_id: str,
    view_token: Optional[str] = None,
) -> ReportResponse | ReportPendingResponse:
    """Get a single report by id (UUID). Approved: full data. Pending with valid view_token: full data (submitter). Pending without token: masked (narrative/type_detail hidden). Rejected: 404."""
    cached = get_report_cached(report_id)
    if cached is not None:
        status = cached.get("status") or "pending"
        if status == "rejected":
            raise HTTPException(status_code=404, detail="Report not found")
        if status != "approved":
            stored_token = cached.get("submitter_view_token")
            if view_token and stored_token and view_token == stored_token:
                return _report_from_record(
                    cached,
                    status="pending",
                    message="This report is waiting for approval. It may take up to 48 hours.",
                )
            return _report_from_record(
                cached,
                status="pending",
                message="This report is waiting for approval. It may take up to 48 hours.",
                mask_sensitive=True,
            )
        return _report_from_record(cached)
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Reports service unavailable")
    try:
        result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail="Reports service unavailable.",
        ) from e
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = result.data[0]
    status = record.get("status") or "pending"
    if status == "rejected":
        raise HTTPException(status_code=404, detail="Report not found")
    if status != "approved":
        stored_token = record.get("submitter_view_token")
        if view_token and stored_token and view_token == stored_token:
            set_report_cached(report_id, record)
            return _report_from_record(
                record,
                status="pending",
                message="This report is waiting for approval. It may take up to 48 hours.",
            )
        return _report_from_record(
            record,
            status="pending",
            message="This report is waiting for approval. It may take up to 48 hours.",
            mask_sensitive=True,
        )
    set_report_cached(report_id, record)
    return _report_from_record(record)


@router.post("/{report_id}/rate", response_model=ReportResponse)
def rate_report(
    report_id: str,
    payload: RatePayload,
    user_id: str = Depends(get_current_user_id),
) -> ReportResponse:
    """Submit a rating for a report (authenticated). One rating per user per report."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Reports service unavailable")
    report_result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    if not report_result.data or len(report_result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = report_result.data[0]
    rid = str(record["id"])
    existing = (
        sb.table("report_raters")
        .select("report_id")
        .eq("report_id", rid)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if existing.data and len(existing.data) > 0:
        raise HTTPException(status_code=409, detail="You have already rated this report")
    sb.table("report_raters").insert({"report_id": rid, "user_id": user_id}).execute()
    new_count = (record.get("rating_count") or 0) + 1
    new_sum_credibility = (record.get("sum_credibility") or 0) + payload.credibility
    new_sum_usefulness = (record.get("sum_usefulness") or 0) + payload.usefulness
    new_sum_completeness = (record.get("sum_completeness") or 0) + payload.completeness
    new_sum_relevance = (record.get("sum_relevance") or 0) + payload.relevance
    sb.table("reports").update(
        {
            "rating_count": new_count,
            "sum_credibility": new_sum_credibility,
            "sum_usefulness": new_sum_usefulness,
            "sum_completeness": new_sum_completeness,
            "sum_relevance": new_sum_relevance,
        }
    ).eq("id", rid).execute()
    updated = sb.table("reports").select("*").eq("id", rid).limit(1).execute()
    if not updated.data or len(updated.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to update report")
    updated_record = updated.data[0]
    set_report_cached(rid, updated_record)
    return _report_from_record(updated_record)
