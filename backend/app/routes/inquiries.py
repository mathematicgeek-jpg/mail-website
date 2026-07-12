"""Lead/Inquiry routes."""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.inquiry import Lead, LeadCreate, LeadStatusUpdate
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api", tags=["leads"])


@router.post("/demo-inquiry", response_model=Lead)
async def create_inquiry(inquiry: LeadCreate):
    """Create a new demo class inquiry (public)."""
    db = get_db()
    lead = Lead(
        name=inquiry.name,
        phone=inquiry.phone,
        email=inquiry.email,
        city=inquiry.city,
        state=inquiry.state,
        country=inquiry.country,
        student_class=inquiry.student_class,
        board=inquiry.board,
        preferred_mode=inquiry.preferred_mode,
        message=inquiry.message,
        source=inquiry.source,
    )
    doc = lead.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    await db.leads.insert_one(doc)
    return lead


@router.get("/demo-inquiries", response_model=List[Lead])
async def get_inquiries(_: str = Depends(get_current_admin)):
    """Get all inquiries (admin only)."""
    db = get_db()
    inquiries = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for i in inquiries:
        for field in ["created_at", "updated_at"]:
            if isinstance(i.get(field), str):
                i[field] = datetime.fromisoformat(i[field])
    return inquiries


@router.get("/demo-inquiries/stats")
async def get_inquiry_stats():
    """Get inquiry statistics."""
    db = get_db()
    total = await db.leads.count_documents({})
    pending = await db.leads.count_documents({"status": "pending"})
    contacted = await db.leads.count_documents({"status": "contacted"})
    enrolled = await db.leads.count_documents({"status": "enrolled"})
    return {"total": total, "pending": pending, "contacted": contacted, "enrolled": enrolled}


@router.put("/admin/inquiry/{inquiry_id}/status")
async def update_inquiry_status(
    inquiry_id: str, update: LeadStatusUpdate, _: str = Depends(get_current_admin)
):
    """Update inquiry status (admin only)."""
    db = get_db()
    result = await db.leads.update_one(
        {"id": inquiry_id},
        {"$set": {"status": update.status, "updated_at": datetime.now(timezone.utc).isoformat()}},
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Status updated", "inquiry_id": inquiry_id, "new_status": update.status}


@router.delete("/admin/inquiry/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, _: str = Depends(get_current_admin)):
    """Delete an inquiry (admin only)."""
    db = get_db()
    result = await db.leads.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"message": "Inquiry deleted", "inquiry_id": inquiry_id}
