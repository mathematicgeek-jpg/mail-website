"""Lead/Inquiry models."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class LeadCreate(BaseModel):
    name: str
    phone: str
    email: str = ""
    city: str = ""
    state: str = ""
    country: str = "India"
    student_class: str = Field(alias="studentClass", default="")
    board: str = ""
    preferred_mode: str = Field(alias="preferredMode", default="")
    message: str = ""
    source: str = "website"  # website, whatsapp, referral

    class Config:
        populate_by_name = True


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str = ""
    city: str = ""
    state: str = ""
    country: str = "India"
    student_class: str = ""
    board: str = ""
    preferred_mode: str = ""
    message: str = ""
    source: str = "website"
    status: str = "pending"  # pending, contacted, enrolled, lost
    whatsapp_engaged: bool = False
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LeadStatusUpdate(BaseModel):
    status: str
