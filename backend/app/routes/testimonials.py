"""Testimonial routes."""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.testimonial import Testimonial, TestimonialCreate, TestimonialApproval
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api", tags=["testimonials"])


@router.post("/testimonial", response_model=Testimonial)
async def create_testimonial(data: TestimonialCreate):
    """Submit a new testimonial (public, requires approval)."""
    db = get_db()
    testimonial = Testimonial(
        name=data.name,
        student_class=data.student_class,
        board=data.board,
        rating=data.rating,
        testimonial=data.testimonial,
        improvement=data.improvement,
    )
    doc = testimonial.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.testimonials.insert_one(doc)
    return testimonial


@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(approved_only: bool = True):
    """Get testimonials (approved only by default)."""
    db = get_db()
    query = {"approved": True} if approved_only else {}
    items = await db.testimonials.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    for t in items:
        if isinstance(t.get("created_at"), str):
            t["created_at"] = datetime.fromisoformat(t["created_at"])
    return items


@router.get("/testimonials/stats")
async def get_testimonial_stats():
    """Get testimonial statistics."""
    db = get_db()
    total = await db.testimonials.count_documents({})
    approved = await db.testimonials.count_documents({"approved": True})
    pending = await db.testimonials.count_documents({"approved": False})
    return {"total": total, "approved": approved, "pending": pending}


@router.put("/admin/testimonial/{testimonial_id}/approve")
async def approve_testimonial(
    testimonial_id: str, approval: TestimonialApproval, _: str = Depends(get_current_admin)
):
    """Approve or reject a testimonial (admin only)."""
    db = get_db()
    result = await db.testimonials.update_one(
        {"id": testimonial_id}, {"$set": {"approved": approval.approved}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    status = "approved" if approval.approved else "rejected"
    return {"message": f"Testimonial {status}", "testimonial_id": testimonial_id}


@router.delete("/admin/testimonial/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, _: str = Depends(get_current_admin)):
    """Delete a testimonial (admin only)."""
    db = get_db()
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted", "testimonial_id": testimonial_id}
