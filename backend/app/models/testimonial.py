"""Testimonial models."""

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class TestimonialCreate(BaseModel):
    name: str
    student_class: str = Field(alias="studentClass", default="")
    board: str = ""
    rating: int = Field(ge=1, le=5)
    testimonial: str = Field(min_length=10)
    improvement: str = ""

    class Config:
        populate_by_name = True


class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    student_class: str = ""
    board: str = ""
    rating: int
    testimonial: str
    improvement: str = ""
    approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TestimonialApproval(BaseModel):
    approved: bool
