"""Report-scam API: create and retrieve reports."""
import logging
import uuid
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.auth.deps import get_current_user_id, get_current_user_id_optional
from app.cache import get_report_cached, set_report_cached
from app.db.supabase import get_supabase
from app.models.report import (
    HelpfulCountsResponse,
    HelpfulVotePayload,
    RatePayload,
    ReportCreate,
    ReportPendingResponse,
    ReportResponse,
)
from app.rate_limit import rate_limit_reports
from app.utils.normalize import normalize_report_type_detail

router = APIRouter(prefix="/reports", tags=["reports"])
logger = logging.getLogger(__name__)


def _generate_slug() -> str:
    """Return a short unique slug for shareable URLs."""
    return uuid.uuid4().hex[:12]


def _get_similar_count(
    sb,
    report_id: str,
    report_type: str,
    report_type_detail: Optional[str],
    report_type_detail_normalized: Optional[str],
) -> int:
    """Return count of other approved reports with same report_type_detail (URL/number)."""
    normalized = report_type_detail_normalized or normalize_report_type_detail(
        report_type, report_type_detail
    )
    if not normalized:
        return 0
    try:
        result = (
            sb.table("reports")
            .select("id")
            .eq("status", "approved")
            .eq("report_type", report_type)
            .eq("report_type_detail_normalized", normalized)
            .neq("id", report_id)
            .execute()
        )
        return len(result.data) if result.data else 0
    except Exception:
        return 0


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
        "report_type_detail_normalized": normalize_report_type_detail(
            payload.report_type, payload.report_type_detail
        ),
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
    user_id: Optional[str] = Depends(get_current_user_id_optional),
) -> ReportResponse | ReportPendingResponse:
    """Get a single report by id (UUID). Approved: full data. If Bearer present and user has rated, includes user_rating for pre-fill/update."""
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
        resp = _report_from_record(cached)
        if cached.get("report_type_detail"):
            sb_similar = get_supabase()
            if sb_similar:
                resp.similar_count = _get_similar_count(
                    sb_similar,
                    report_id,
                    cached["report_type"],
                    cached.get("report_type_detail"),
                    cached.get("report_type_detail_normalized"),
                )
        if user_id:
            sb = get_supabase()
            if sb:
                rater_row = (
                    sb.table("report_raters")
                    .select("credibility, usefulness, completeness, relevance")
                    .eq("report_id", report_id)
                    .eq("user_id", user_id)
                    .limit(1)
                    .execute()
                )
                if rater_row.data and len(rater_row.data) > 0 and rater_row.data[0].get("credibility") is not None:
                    r = rater_row.data[0]
                    resp.user_rating = RatePayload(
                        credibility=r["credibility"],
                        usefulness=r.get("usefulness") or 1,
                        completeness=r.get("completeness") or 1,
                        relevance=r.get("relevance") or 1,
                    )
        return resp
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
    resp = _report_from_record(record)
    if record.get("report_type_detail"):
        resp.similar_count = _get_similar_count(
            sb,
            report_id,
            record["report_type"],
            record.get("report_type_detail"),
            record.get("report_type_detail_normalized"),
        )
    if user_id and (record.get("status") or "pending") == "approved":
        rater_row = (
            sb.table("report_raters")
            .select("credibility, usefulness, completeness, relevance")
            .eq("report_id", report_id)
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )
        if rater_row.data and len(rater_row.data) > 0 and rater_row.data[0].get("credibility") is not None:
            r = rater_row.data[0]
            resp.user_rating = RatePayload(
                credibility=r["credibility"],
                usefulness=r.get("usefulness") or 1,
                completeness=r.get("completeness") or 1,
                relevance=r.get("relevance") or 1,
            )
    return resp


def _get_helpful_counts(sb, report_id: str) -> tuple[int, int]:
    """Return (helpful_count, not_helpful_count) for a report."""
    result = (
        sb.table("report_helpful_votes")
        .select("helpful")
        .eq("report_id", report_id)
        .execute()
    )
    helpful_count = sum(1 for r in (result.data or []) if r.get("helpful") is True)
    not_helpful_count = sum(1 for r in (result.data or []) if r.get("helpful") is False)
    return helpful_count, not_helpful_count


def _get_user_helpful_vote(sb, report_id: str, user_id: str) -> Optional[bool]:
    """Return the current user's vote (True/False) or None."""
    result = (
        sb.table("report_helpful_votes")
        .select("helpful")
        .eq("report_id", report_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not result.data or len(result.data) == 0:
        return None
    return result.data[0].get("helpful")


@router.get("/{report_id}/helpful", response_model=HelpfulCountsResponse)
def get_report_helpful(
    report_id: str,
    user_id: Optional[str] = Depends(get_current_user_id_optional),
) -> HelpfulCountsResponse:
    """Get helpful/not helpful counts for a report. If authenticated, also return user_vote."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Reports service unavailable")
    report_result = sb.table("reports").select("id, status").eq("id", report_id).limit(1).execute()
    if not report_result.data or len(report_result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    if (report_result.data[0].get("status") or "pending") != "approved":
        raise HTTPException(status_code=404, detail="Report not found")
    helpful_count, not_helpful_count = _get_helpful_counts(sb, report_id)
    user_vote: Optional[bool] = _get_user_helpful_vote(sb, report_id, user_id) if user_id else None
    return HelpfulCountsResponse(
        helpful_count=helpful_count,
        not_helpful_count=not_helpful_count,
        user_vote=user_vote,
    )


@router.post("/{report_id}/helpful", response_model=HelpfulCountsResponse)
def post_report_helpful(
    report_id: str,
    payload: HelpfulVotePayload,
    user_id: str = Depends(get_current_user_id),
) -> HelpfulCountsResponse:
    """Set or update "Did this help?" vote for a report (authenticated). One vote per user per report."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Reports service unavailable")
    report_result = sb.table("reports").select("id, status").eq("id", report_id).limit(1).execute()
    if not report_result.data or len(report_result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    if (report_result.data[0].get("status") or "pending") != "approved":
        raise HTTPException(status_code=404, detail="Report not found")
    rid = str(report_result.data[0]["id"])
    try:
        sb.table("report_helpful_votes").upsert(
            [{"report_id": rid, "user_id": user_id, "helpful": payload.helpful}],
            on_conflict="report_id,user_id",
        ).execute()
    except Exception as e:
        logger.exception("Helpful vote upsert failed: %s", e)
        raise HTTPException(status_code=503, detail="Vote failed") from e
    helpful_count, not_helpful_count = _get_helpful_counts(sb, rid)
    return HelpfulCountsResponse(
        helpful_count=helpful_count,
        not_helpful_count=not_helpful_count,
        user_vote=payload.helpful,
    )


@router.post("/{report_id}/rate", response_model=ReportResponse)
def rate_report(
    report_id: str,
    payload: RatePayload,
    user_id: str = Depends(get_current_user_id),
) -> ReportResponse:
    """Submit or update a rating for a report (authenticated). One rating per user; user can change it by submitting again."""
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
        .select("credibility, usefulness, completeness, relevance")
        .eq("report_id", rid)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )
    if not existing.data or len(existing.data) == 0:
        sb.table("report_raters").insert({
            "report_id": rid,
            "user_id": user_id,
            "credibility": payload.credibility,
            "usefulness": payload.usefulness,
            "completeness": payload.completeness,
            "relevance": payload.relevance,
        }).execute()
        new_count = (record.get("rating_count") or 0) + 1
        new_sum_credibility = (record.get("sum_credibility") or 0) + payload.credibility
        new_sum_usefulness = (record.get("sum_usefulness") or 0) + payload.usefulness
        new_sum_completeness = (record.get("sum_completeness") or 0) + payload.completeness
        new_sum_relevance = (record.get("sum_relevance") or 0) + payload.relevance
    else:
        row = existing.data[0]
        old_c = row.get("credibility")
        old_u = row.get("usefulness")
        old_co = row.get("completeness")
        old_r = row.get("relevance")
        if old_c is None:
            raise HTTPException(status_code=409, detail="You have already rated this report (rating cannot be changed for this report).")
        sb.table("report_raters").update({
            "credibility": payload.credibility,
            "usefulness": payload.usefulness,
            "completeness": payload.completeness,
            "relevance": payload.relevance,
        }).eq("report_id", rid).eq("user_id", user_id).execute()
        new_count = record.get("rating_count") or 0
        new_sum_credibility = (record.get("sum_credibility") or 0) - old_c + payload.credibility
        new_sum_usefulness = (record.get("sum_usefulness") or 0) - old_u + payload.usefulness
        new_sum_completeness = (record.get("sum_completeness") or 0) - old_co + payload.completeness
        new_sum_relevance = (record.get("sum_relevance") or 0) - old_r + payload.relevance
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
