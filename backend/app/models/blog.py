"""Blog post models."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone
import uuid


class BlogPostCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: str = ""
    category: str
    tags: List[str] = []
    meta_title: str = ""
    meta_description: str = ""
    meta_keywords: List[str] = []
    author: str = "Aarti Agarwal"
    read_time: int = 5
    status: str = "draft"


class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    featured_image: str = ""
    category: str
    tags: List[str] = []
    meta_title: str = ""
    meta_description: str = ""
    meta_keywords: List[str] = []
    author: str = "Aarti Agarwal"
    read_time: int = 5
    status: str = "draft"
    views: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class BlogPostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[List[str]] = None
    status: Optional[str] = None
