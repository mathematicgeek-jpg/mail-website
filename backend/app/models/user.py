"""User/Student models."""

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    student_class: str = Field(alias="studentClass", default="")
    board: str = ""
    role: str = "student"


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    student_class: Optional[str] = None
    board: Optional[str] = None
    status: Optional[str] = None  # active, inactive, pending
    password: Optional[str] = None


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    student_class: str = ""
    board: str = ""
    role: str = "student"  # admin, student
    status: str = "pending"  # active, inactive, pending
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    student_class: str
    board: str
    role: str
    status: str
    created_at: datetime
    updated_at: datetime
