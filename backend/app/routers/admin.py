"""Admin API: login and report moderation."""
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException

from app.auth.admin import (
    AdminLoginPayload,
    AdminTokenResponse,
    create_admin_token,
    get_admin_from_token,
    verify_admin_credentials,
)
from app.cache import invalidate_report_cached, set_report_cached
from app.db.supabase import get_supabase
from app.models.report import (
    AdminReportResponse,
    AdminReportsListResponse,
    AdminReportUpdate,
    AdminApprovedStatsCategory,
    AdminApprovedStatsResponse,
    ReportResponse,
)
from app.models.contact import (
    ContactMessageResponse,
    ContactMessagesListResponse,
)

router = APIRouter(prefix="/z7k2m9", tags=["admin"])


def _report_from_record(record: dict[str, Any]) -> ReportResponse:
    """Build ReportResponse from a reports row (no status in public response)."""
    from app.routers.reports import _report_from_record as _public

    return _public(record)


def _admin_report_from_record(record: dict[str, Any]) -> AdminReportResponse:
    """Build AdminReportResponse including status."""
    base = _report_from_record(record)
    status = record.get("status") or "pending"
    data = base.model_dump()
    data["status"] = status
    return AdminReportResponse(**data)


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginPayload) -> AdminTokenResponse:
    """Authenticate admin with username and password. Returns JWT for admin endpoints."""
    if not verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_admin_token(payload.username)
    return AdminTokenResponse(access_token=token)


@router.get("/reports", response_model=AdminReportsListResponse)
def list_reports(
    _admin: str = Depends(get_admin_from_token),
    status: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> AdminReportsListResponse:
    """List reports with optional status filter (pending, approved, rejected) and pagination. Admin only."""
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 20
    if page_size > 100:
        page_size = 100
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        base = sb.table("reports").select("*").order("created_at", desc=True)
        if status is not None:
            base = base.eq("status", status)
        offset = (page - 1) * page_size
        result = base.range(offset, offset + page_size - 1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    data = result.data or []
    if status is not None and len(data) < page_size:
        total = offset + len(data)
    else:
        try:
            count_query = sb.table("reports").select("id")
            if status is not None:
                count_query = count_query.eq("status", status)
            count_result = count_query.execute()
            total = len(count_result.data or [])
        except Exception:
            total = offset + len(data)
    items = [_admin_report_from_record(r) for r in data]
    return AdminReportsListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/stats", response_model=AdminApprovedStatsResponse)
def get_approved_stats(
    _admin: str = Depends(get_admin_from_token),
) -> AdminApprovedStatsResponse:
    """Return total approved report count and counts grouped by scam category. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = (
            sb.table("reports")
            .select("category")
            .eq("status", "approved")
            .limit(50_000)
            .execute()
        )
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    data = result.data or []
    total_approved = len(data)
    counts: dict[str | None, int] = {}
    for row in data:
        cat = row.get("category") if row.get("category") else None
        counts[cat] = counts.get(cat, 0) + 1
    by_category = [
        AdminApprovedStatsCategory(category=cat, count=n)
        for cat, n in sorted(counts.items(), key=lambda x: (-x[1], str(x[0]) or "")
        )
    ]
    return AdminApprovedStatsResponse(
        total_approved=total_approved,
        by_category=by_category,
    )


@router.get("/reports/{report_id}", response_model=AdminReportResponse)
def get_report(
    report_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> AdminReportResponse:
    """Get full report by id (any status). Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return _admin_report_from_record(result.data[0])


@router.patch("/reports/{report_id}", response_model=AdminReportResponse)
def update_report(
    report_id: str,
    payload: AdminReportUpdate,
    _admin: str = Depends(get_admin_from_token),
) -> AdminReportResponse:
    """Update report details. Admin only. Only provided fields are updated."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return _admin_report_from_record(result.data[0])
    try:
        sb.table("reports").update(updates).eq("id", report_id).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    updated = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    if not updated.data or len(updated.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to update report")
    updated_record = updated.data[0]
    invalidate_report_cached(report_id)
    if (updated_record.get("status") or "pending") == "approved":
        set_report_cached(report_id, updated_record)
    return _admin_report_from_record(updated_record)


@router.post("/reports/{report_id}/approve", response_model=AdminReportResponse)
def approve_report(
    report_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> AdminReportResponse:
    """Set report status to approved so it is visible to the public. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = result.data[0]
    if (record.get("status") or "pending") == "approved":
        return _admin_report_from_record(record)
    try:
        sb.table("reports").update({"status": "approved"}).eq("id", report_id).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    updated = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    if not updated.data or len(updated.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to update report")
    updated_record = updated.data[0]
    invalidate_report_cached(report_id)
    set_report_cached(report_id, updated_record)
    return _admin_report_from_record(updated_record)


@router.post("/reports/{report_id}/reject", response_model=AdminReportResponse)
def reject_report(
    report_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> AdminReportResponse:
    """Set report status to rejected so it is not visible to the public. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = result.data[0]
    if (record.get("status") or "pending") == "rejected":
        return _admin_report_from_record(record)
    try:
        sb.table("reports").update({"status": "rejected"}).eq("id", report_id).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    updated = sb.table("reports").select("*").eq("id", report_id).limit(1).execute()
    if not updated.data or len(updated.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to update report")
    updated_record = updated.data[0]
    invalidate_report_cached(report_id)
    return _admin_report_from_record(updated_record)


@router.delete("/reports/{report_id}", status_code=204)
def delete_report(
    report_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> None:
    """Permanently delete a report and its ratings. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("id").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    try:
        sb.table("reports").delete().eq("id", report_id).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    invalidate_report_cached(report_id)


def _contact_message_from_record(record: dict[str, Any]) -> ContactMessageResponse:
    """Build ContactMessageResponse from a contact_messages row."""
    return ContactMessageResponse(
        id=str(record["id"]),
        name=record.get("name"),
        email=record.get("email"),
        message=record["message"],
        read=record.get("read", False),
        created_at=record["created_at"],
    )


@router.get("/messages", response_model=ContactMessagesListResponse)
def list_contact_messages(
    _admin: str = Depends(get_admin_from_token),
    read: Optional[bool] = None,
    page: int = 1,
    page_size: int = 50,
) -> ContactMessagesListResponse:
    """List contact form messages. Admin only. Optional filter by read (true/false)."""
    if page < 1:
        page = 1
    if page_size < 1:
        page_size = 50
    if page_size > 100:
        page_size = 100
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        base = sb.table("contact_messages").select("*").order("created_at", desc=True)
        if read is not None:
            base = base.eq("read", read)
        offset = (page - 1) * page_size
        result = base.range(offset, offset + page_size - 1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    data = result.data or []
    if read is not None and len(data) < page_size:
        total = offset + len(data)
    else:
        try:
            count_query = sb.table("contact_messages").select("id")
            if read is not None:
                count_query = count_query.eq("read", read)
            count_result = count_query.execute()
            total = len(count_result.data or [])
        except Exception:
            total = offset + len(data)
    items = [_contact_message_from_record(r) for r in data]
    return ContactMessagesListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/messages/{message_id}", response_model=ContactMessageResponse)
def get_contact_message(
    message_id: str,
    _admin: str = Depends(get_admin_from_token),
    mark_read: bool = True,
) -> ContactMessageResponse:
    """Get one contact message by id. Optionally mark as read (default true). Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("contact_messages").select("*").eq("id", message_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    record = result.data[0]
    if mark_read and not record.get("read"):
        try:
            sb.table("contact_messages").update({"read": True}).eq("id", message_id).execute()
            record = {**record, "read": True}
        except Exception:
            pass
    return _contact_message_from_record(record)


@router.patch("/messages/{message_id}/read", response_model=ContactMessageResponse)
def mark_contact_message_read(
    message_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> ContactMessageResponse:
    """Mark a contact message as read. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        sb.table("contact_messages").update({"read": True}).eq("id", message_id).execute()
        result = sb.table("contact_messages").select("*").eq("id", message_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return _contact_message_from_record(result.data[0])


@router.delete("/messages/{message_id}", status_code=204)
def delete_contact_message(
    message_id: str,
    _admin: str = Depends(get_admin_from_token),
) -> None:
    """Permanently delete a contact message. Admin only."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("contact_messages").select("id").eq("id", message_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    try:
        sb.table("contact_messages").delete().eq("id", message_id).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
