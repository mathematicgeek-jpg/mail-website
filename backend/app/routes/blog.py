"""Blog routes."""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timezone
from app.database import get_db
from app.models.blog import BlogPost, BlogPostCreate, BlogPostUpdate
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api", tags=["blog"])


@router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(category: Optional[str] = None, tag: Optional[str] = None, limit: int = 50, skip: int = 0):
    """Get published blog posts with optional filtering."""
    db = get_db()
    query = {"status": "published"}
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag

    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    for p in posts:
        for f in ["created_at", "updated_at"]:
            if isinstance(p.get(f), str):
                p[f] = datetime.fromisoformat(p[f])
    return posts


@router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_blog_post(slug: str):
    """Get a single blog post by slug (increments views)."""
    db = get_db()
    post = await db.blog_posts.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    await db.blog_posts.update_one({"slug": slug}, {"$inc": {"views": 1}})
    for f in ["created_at", "updated_at"]:
        if isinstance(post.get(f), str):
            post[f] = datetime.fromisoformat(post[f])
    return post


@router.get("/blog/categories")
async def get_blog_categories():
    """Get blog categories with post counts."""
    db = get_db()
    cats = await db.blog_posts.aggregate([
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]).to_list(100)
    return [{"name": c["_id"], "count": c["count"]} for c in cats]


@router.get("/blog/related/{slug}")
async def get_related_posts(slug: str, limit: int = 3):
    """Get related posts based on category/tags."""
    db = get_db()
    current = await db.blog_posts.find_one({"slug": slug}, {"_id": 0, "category": 1, "tags": 1})
    if not current:
        return []
    related = await db.blog_posts.find(
        {
            "slug": {"$ne": slug},
            "status": "published",
            "$or": [
                {"category": current.get("category")},
                {"tags": {"$in": current.get("tags", [])}},
            ],
        },
        {"_id": 0, "id": 1, "title": 1, "slug": 1, "excerpt": 1, "featured_image": 1, "category": 1, "read_time": 1, "created_at": 1},
    ).limit(limit).to_list(limit)
    return related


# Admin blog endpoints
@router.post("/admin/blog/posts", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate, _: str = Depends(get_current_admin)):
    """Create a new blog post (admin only)."""
    db = get_db()
    existing = await db.blog_posts.find_one({"slug": post.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    post_obj = BlogPost(**post.model_dump())
    doc = post_obj.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    await db.blog_posts.insert_one(doc)
    return post_obj


@router.put("/admin/blog/posts/{post_id}")
async def update_blog_post(post_id: str, update: BlogPostUpdate, _: str = Depends(get_current_admin)):
    """Update a blog post (admin only)."""
    db = get_db()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post updated", "post_id": post_id}


@router.delete("/admin/blog/posts/{post_id}")
async def delete_blog_post(post_id: str, _: str = Depends(get_current_admin)):
    """Delete a blog post (admin only)."""
    db = get_db()
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted", "post_id": post_id}


@router.get("/admin/blog/posts/all")
async def get_all_blog_posts_admin(_: str = Depends(get_current_admin)):
    """Get all blog posts including drafts (admin only)."""
    db = get_db()
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for p in posts:
        for f in ["created_at", "updated_at"]:
            if isinstance(p.get(f), str):
                p[f] = datetime.fromisoformat(p[f])
    return posts
