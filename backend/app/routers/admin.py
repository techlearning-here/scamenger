"""Admin API: login and report moderation."""
import csv
import io
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response

from app.auth.admin import (
    AdminLoginPayload,
    AdminTokenResponse,
    create_admin_token,
    get_admin_from_token,
    verify_admin_credentials,
)
from app.cache import get_config_cached, invalidate_config_cached, invalidate_report_cached, set_config_cached, set_report_cached
from app.db.supabase import get_supabase
from app.models.report import (
    AdminReportResponse,
    AdminReportsListResponse,
    AdminReportUpdate,
    AdminApprovedStatsCategory,
    AdminApprovedStatsResponse,
    ReportResponse,
)
from app.utils.normalize import normalize_report_type_detail
from app.models.contact import (
    ContactMessageResponse,
    ContactMessagesListResponse,
)
from app.models.facebook import FacebookPostRequest, FacebookPostResponse, FacebookStatusResponse
from app.models.threads import ThreadsPostRequest, ThreadsPostResponse, ThreadsStatusResponse
from app.models.settings import SiteSettingsResponse, SiteSettingsUpdate
from app.services.facebook import post_to_facebook_page
from app.services.threads import post_to_threads
from app.utils.facebook import build_post_message
from app.core.config import ENCRYPTION_KEY_B64, FACEBOOK_POSTING_ENABLED, THREADS_POSTING_ENABLED
from app.utils.crypto import decrypt_password

router = APIRouter(prefix="/z7k2m9", tags=["admin"])


def _report_from_record(record: dict[str, Any]) -> ReportResponse:
    """Build ReportResponse from a reports row (no status in public response)."""
    from app.routers.reports import _report_from_record as _public

    return _public(record)


def _admin_report_from_record(record: dict[str, Any]) -> AdminReportResponse:
    """Build AdminReportResponse including status and Facebook post info."""
    base = _report_from_record(record)
    status = record.get("status") or "pending"
    data = base.model_dump()
    data["status"] = status
    data["facebook_post_id"] = record.get("facebook_post_id")
    data["facebook_posted_at"] = record.get("facebook_posted_at")
    data["facebook_permalink"] = record.get("facebook_permalink")
    return AdminReportResponse(**data)


@router.post("/login", response_model=AdminTokenResponse)
def admin_login(payload: AdminLoginPayload) -> AdminTokenResponse:
    """Authenticate admin with username and password. Returns JWT for admin endpoints. Accepts plaintext password or password_encrypted when ENCRYPTION_KEY is set."""
    password: str | None = None
    if payload.password_encrypted and ENCRYPTION_KEY_B64:
        password = decrypt_password(payload.password_encrypted, ENCRYPTION_KEY_B64)
    elif payload.password is not None:
        password = payload.password
    if not password or not verify_admin_credentials(payload.username, password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_admin_token(payload.username)
    return AdminTokenResponse(access_token=token)


# Literal paths first so /messages and /settings are matched before /reports/{report_id}.
def _get_site_setting(sb, key: str, default: Any) -> Any:
    """Read a single site_settings value."""
    try:
        result = sb.table("site_settings").select("value").eq("key", key).limit(1).execute()
        if result.data and len(result.data) > 0:
            val = result.data[0].get("value", default)
            if isinstance(val, bool):
                return val
            if isinstance(val, str) and val.lower() in ("true", "1", "yes"):
                return True
            if val is not None:
                return bool(val)
    except Exception:
        pass
    return default


@router.get("/settings", response_model=SiteSettingsResponse)
def get_settings(
    _admin: str = Depends(get_admin_from_token),
) -> SiteSettingsResponse:
    """Get site settings. Admin only. Uses config cache when present to avoid DB."""
    cached = get_config_cached()
    if cached is not None:
        return SiteSettingsResponse(
            show_facebook_consent=cached.get("show_facebook_consent", True),
            show_report_scam=cached.get("show_report_scam", True),
        )
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    show_fb = _get_site_setting(sb, "show_facebook_consent", True)
    show_report = _get_site_setting(sb, "show_report_scam", True)
    set_config_cached({"show_facebook_consent": show_fb, "show_report_scam": show_report})
    return SiteSettingsResponse(show_facebook_consent=show_fb, show_report_scam=show_report)


@router.patch("/settings", response_model=SiteSettingsResponse)
def update_settings(
    payload: SiteSettingsUpdate,
    _admin: str = Depends(get_admin_from_token),
) -> SiteSettingsResponse:
    """Update site settings. Admin only. Only provided fields are updated."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        show_fb = _get_site_setting(sb, "show_facebook_consent", True)
        show_report = _get_site_setting(sb, "show_report_scam", True)
        return SiteSettingsResponse(show_facebook_consent=show_fb, show_report_scam=show_report)
    if "show_facebook_consent" in updates:
        try:
            sb.table("site_settings").upsert(
                {"key": "show_facebook_consent", "value": updates["show_facebook_consent"]},
                on_conflict="key",
            ).execute()
        except Exception:
            raise HTTPException(status_code=503, detail="Service unavailable") from None
    if "show_report_scam" in updates:
        try:
            sb.table("site_settings").upsert(
                {"key": "show_report_scam", "value": updates["show_report_scam"]},
                on_conflict="key",
            ).execute()
        except Exception:
            raise HTTPException(status_code=503, detail="Service unavailable") from None
    invalidate_config_cached()
    show_fb = _get_site_setting(sb, "show_facebook_consent", True)
    show_report = _get_site_setting(sb, "show_report_scam", True)
    return SiteSettingsResponse(show_facebook_consent=show_fb, show_report_scam=show_report)


@router.get("/facebook/status", response_model=FacebookStatusResponse)
def get_facebook_status(
    _admin: str = Depends(get_admin_from_token),
) -> FacebookStatusResponse:
    """Return whether Facebook posting is configured. Admin only."""
    return FacebookStatusResponse(enabled=FACEBOOK_POSTING_ENABLED)


@router.get("/threads/status", response_model=ThreadsStatusResponse)
def get_threads_status(
    _admin: str = Depends(get_admin_from_token),
) -> ThreadsStatusResponse:
    """Return whether Threads posting is configured. Admin only."""
    return ThreadsStatusResponse(enabled=THREADS_POSTING_ENABLED)


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


@router.get("/newsletter/export")
def export_newsletter_subscribers(
    _admin: str = Depends(get_admin_from_token),
) -> Response:
    """Export subscribed newsletter subscribers as CSV. Admin only. For use with provider UI (Resend, Mailchimp, etc.)."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = (
            sb.table("newsletter_subscribers")
            .select("email,name,unsubscribe_token,topic,frequency,consent_at,created_at")
            .eq("status", "subscribed")
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as e:
        if "topic" in str(e) or "frequency" in str(e):
            result = (
                sb.table("newsletter_subscribers")
                .select("email,name,unsubscribe_token,consent_at,created_at")
                .eq("status", "subscribed")
                .order("created_at", desc=True)
                .execute()
            )
        else:
            raise HTTPException(status_code=503, detail="Service unavailable") from e
    rows = result.data or []
    buf = io.StringIO()
    has_topic_freq = rows and ("topic" in (rows[0] or {}))
    writer = csv.writer(buf)
    if has_topic_freq:
        writer.writerow(["email", "name", "unsubscribe_token", "topic", "frequency", "consent_at", "created_at"])
        for r in rows:
            writer.writerow([
                r.get("email") or "",
                r.get("name") or "",
                r.get("unsubscribe_token") or "",
                r.get("topic") or "",
                r.get("frequency") or "",
                r.get("consent_at") or "",
                r.get("created_at") or "",
            ])
    else:
        writer.writerow(["email", "name", "unsubscribe_token", "consent_at", "created_at"])
        for r in rows:
            writer.writerow([
                r.get("email") or "",
                r.get("name") or "",
                r.get("unsubscribe_token") or "",
                r.get("consent_at") or "",
                r.get("created_at") or "",
            ])
    csv_content = buf.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=newsletter-subscribers.csv"},
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


@router.post("/reports/{report_id}/post-to-facebook", response_model=FacebookPostResponse)
def post_report_to_facebook(
    report_id: str,
    payload: FacebookPostRequest = FacebookPostRequest(),
    _admin: str = Depends(get_admin_from_token),
) -> FacebookPostResponse:
    """Post an anonymized summary of the report to the Scam Avenger Facebook Page. Admin only. Optional body: { \"message\": \"...\" }. If message is omitted, backend builds the summary from report data. Requires FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN to be set."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("id, report_type, country_origin, category, lost_money, lost_money_range").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = result.data[0]
    message = (payload.message and payload.message.strip()) or build_post_message(record)
    try:
        out = post_to_facebook_page(message)
        permalink = out.get("permalink", "")
        posted_at = datetime.now(timezone.utc).isoformat()
        try:
            sb.table("reports").update({
                "facebook_post_id": out["id"],
                "facebook_posted_at": posted_at,
                "facebook_permalink": permalink or None,
            }).eq("id", report_id).execute()
        except Exception:
            pass
        invalidate_report_cached(report_id)
        return FacebookPostResponse(post_id=out["id"], permalink=permalink)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        if hasattr(e, "response") and getattr(e, "response") is not None:
            resp = e.response
            try:
                err_data = resp.json()
                msg = err_data.get("error", {}).get("message", resp.text)
            except Exception:
                msg = resp.text or str(e)
            raise HTTPException(status_code=502, detail=f"Facebook API error: {msg}") from e
        raise HTTPException(status_code=502, detail="Failed to post to Facebook") from e


@router.post("/reports/{report_id}/post-to-threads", response_model=ThreadsPostResponse)
def post_report_to_threads(
    report_id: str,
    payload: ThreadsPostRequest = ThreadsPostRequest(),
    _admin: str = Depends(get_admin_from_token),
) -> ThreadsPostResponse:
    """Post an anonymized summary of the report to the Scam Avenger Threads account. Admin only. Optional body: { \"message\": \"...\" }. If message is omitted, backend builds the summary from report data. Text is truncated to 500 chars for Threads. Requires THREADS_USER_ID and THREADS_ACCESS_TOKEN to be set."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        result = sb.table("reports").select("id, report_type, country_origin, category, lost_money, lost_money_range").eq("id", report_id).limit(1).execute()
    except Exception:
        raise HTTPException(status_code=503, detail="Service unavailable") from None
    if not result.data or len(result.data) == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    record = result.data[0]
    message = (payload.message and payload.message.strip()) or build_post_message(record)
    try:
        out = post_to_threads(message)
        return ThreadsPostResponse(post_id=out["id"], permalink=out.get("permalink", ""))
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        if hasattr(e, "response") and getattr(e, "response") is not None:
            resp = e.response
            try:
                err_data = resp.json()
                msg = err_data.get("error", {}).get("message", resp.text)
            except Exception:
                msg = resp.text or str(e)
            raise HTTPException(status_code=502, detail=f"Threads API error: {msg}") from e
        raise HTTPException(status_code=502, detail="Failed to post to Threads") from e


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
    # Never allow admin to change submitter consent flags
    for key in list(updates.keys()):
        if key.startswith("consent_"):
            del updates[key]
    if "report_type" in updates or "report_type_detail" in updates:
        report_type = updates.get("report_type", result.data[0].get("report_type"))
        report_type_detail = updates.get("report_type_detail", result.data[0].get("report_type_detail"))
        updates["report_type_detail_normalized"] = normalize_report_type_detail(
            report_type, report_type_detail
        )
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

