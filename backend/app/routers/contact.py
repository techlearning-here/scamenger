"""Public contact form: submit message (stored in DB for admin to view)."""
from fastapi import APIRouter, Depends, HTTPException

from app.db.supabase import get_supabase
from app.models.contact import ContactCreate, ContactMessageResponse
from app.rate_limit import rate_limit_contact

router = APIRouter(tags=["contact"])


@router.post("/contact", response_model=ContactMessageResponse, status_code=201)
def create_contact_message(
    payload: ContactCreate,
    _: None = Depends(rate_limit_contact),
) -> ContactMessageResponse:
    """Submit a contact form message. Stored for admin to read/delete in dashboard."""
    sb = get_supabase()
    if not sb:
        raise HTTPException(status_code=503, detail="Contact form unavailable")
    row = {
        "name": payload.name.strip(),
        "email": payload.email.strip(),
        "message": payload.message.strip(),
    }
    try:
        result = sb.table("contact_messages").insert(row).execute()
    except Exception as e:
        raise HTTPException(status_code=503, detail="Contact form unavailable") from e
    if not result.data or len(result.data) != 1:
        raise HTTPException(status_code=500, detail="Failed to save message")
    record = result.data[0]
    return ContactMessageResponse(
        id=str(record["id"]),
        name=record.get("name"),
        email=record.get("email"),
        message=record["message"],
        read=record.get("read", False),
        created_at=record["created_at"],
    )
