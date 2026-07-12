from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import secrets
from seo_utils import (
    generate_sitemap_xml, 
    get_static_pages, 
    get_programmatic_pages,
    generate_organization_schema,
    generate_course_schema,
    generate_faq_schema,
    HOMEPAGE_FAQS
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Simple HTTP Basic Auth for admin
security = HTTPBasic()

# Admin credentials (in production, use environment variables and hashed passwords)
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify admin credentials"""
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Demo Inquiry Models
class DemoInquiryCreate(BaseModel):
    name: str
    phone: str
    email: str = ""
    city: str
    state: str
    country: str
    studentClass: str
    board: str
    preferredMode: str
    message: str = ""

class DemoInquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str = ""
    city: str
    state: str
    country: str
    studentClass: str
    board: str
    preferredMode: str
    message: str = ""
    status: str = "pending"  # pending, contacted, enrolled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Testimonial Models
class TestimonialCreate(BaseModel):
    name: str
    studentClass: str
    board: str
    rating: int = Field(ge=1, le=5)  # Rating between 1 and 5
    testimonial: str = Field(min_length=50)  # Minimum 50 characters
    improvement: str = ""

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    studentClass: str
    board: str
    rating: int
    testimonial: str
    improvement: str = ""
    approved: bool = False  # For moderation
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Admin Update Models
class InquiryStatusUpdate(BaseModel):
    status: str  # pending, contacted, enrolled

class TestimonialApproval(BaseModel):
    approved: bool

# Blog Models
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
    read_time: int = 5  # minutes
    status: str = "draft"  # draft, published

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

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Demo Inquiry Endpoints
@api_router.post("/demo-inquiry", response_model=DemoInquiry)
async def create_demo_inquiry(inquiry: DemoInquiryCreate):
    """Create a new demo class inquiry"""
    inquiry_obj = DemoInquiry(**inquiry.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = inquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.demo_inquiries.insert_one(doc)
    
    logger.info(f"New demo inquiry received from {inquiry_obj.name} - {inquiry_obj.phone}")
    
    return inquiry_obj

@api_router.get("/demo-inquiries", response_model=List[DemoInquiry])
async def get_demo_inquiries():
    """Get all demo inquiries (for admin panel)"""
    inquiries = await db.demo_inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for inquiry in inquiries:
        if isinstance(inquiry['created_at'], str):
            inquiry['created_at'] = datetime.fromisoformat(inquiry['created_at'])
        if isinstance(inquiry['updated_at'], str):
            inquiry['updated_at'] = datetime.fromisoformat(inquiry['updated_at'])
    
    return inquiries

@api_router.get("/demo-inquiries/stats")
async def get_inquiry_stats():
    """Get statistics about demo inquiries"""
    total = await db.demo_inquiries.count_documents({})
    pending = await db.demo_inquiries.count_documents({"status": "pending"})
    contacted = await db.demo_inquiries.count_documents({"status": "contacted"})
    enrolled = await db.demo_inquiries.count_documents({"status": "enrolled"})
    
    return {
        "total": total,
        "pending": pending,
        "contacted": contacted,
        "enrolled": enrolled
    }

# Testimonial Endpoints
@api_router.post("/testimonial", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a new testimonial (requires approval before showing on website)"""
    testimonial_obj = Testimonial(**testimonial.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = testimonial_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.testimonials.insert_one(doc)
    
    logger.info(f"New testimonial received from {testimonial_obj.name} - Rating: {testimonial_obj.rating}")
    
    return testimonial_obj

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(approved_only: bool = True):
    """Get testimonials (approved only by default for public display)"""
    query = {"approved": True} if approved_only else {}
    testimonials = await db.testimonials.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert ISO string timestamps back to datetime objects
    for testimonial in testimonials:
        if isinstance(testimonial['created_at'], str):
            testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    
    return testimonials

@api_router.get("/testimonials/stats")
async def get_testimonial_stats():
    """Get statistics about testimonials"""
    total = await db.testimonials.count_documents({})
    approved = await db.testimonials.count_documents({"approved": True})
    pending = await db.testimonials.count_documents({"approved": False})
    
    return {
        "total": total,
        "approved": approved,
        "pending": pending
    }

# Admin Endpoints (Protected)
@api_router.get("/admin/dashboard-stats", dependencies=[Depends(verify_admin)])
async def get_admin_dashboard_stats():
    """Get all statistics for admin dashboard"""
    # Inquiry stats
    total_inquiries = await db.demo_inquiries.count_documents({})
    pending_inquiries = await db.demo_inquiries.count_documents({"status": "pending"})
    contacted_inquiries = await db.demo_inquiries.count_documents({"status": "contacted"})
    enrolled_inquiries = await db.demo_inquiries.count_documents({"status": "enrolled"})
    
    # Testimonial stats
    total_testimonials = await db.testimonials.count_documents({})
    approved_testimonials = await db.testimonials.count_documents({"approved": True})
    pending_testimonials = await db.testimonials.count_documents({"approved": False})
    
    return {
        "inquiries": {
            "total": total_inquiries,
            "pending": pending_inquiries,
            "contacted": contacted_inquiries,
            "enrolled": enrolled_inquiries
        },
        "testimonials": {
            "total": total_testimonials,
            "approved": approved_testimonials,
            "pending": pending_testimonials
        }
    }

@api_router.put("/admin/inquiry/{inquiry_id}/status", dependencies=[Depends(verify_admin)])
async def update_inquiry_status(inquiry_id: str, update: InquiryStatusUpdate):
    """Update demo inquiry status"""
    result = await db.demo_inquiries.update_one(
        {"id": inquiry_id},
        {
            "$set": {
                "status": update.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    logger.info(f"Inquiry {inquiry_id} status updated to {update.status}")
    return {"message": "Status updated successfully", "inquiry_id": inquiry_id, "new_status": update.status}

@api_router.put("/admin/testimonial/{testimonial_id}/approve", dependencies=[Depends(verify_admin)])
async def update_testimonial_approval(testimonial_id: str, approval: TestimonialApproval):
    """Approve or reject testimonial"""
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": {"approved": approval.approved}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    status = "approved" if approval.approved else "rejected"
    logger.info(f"Testimonial {testimonial_id} {status}")
    return {"message": f"Testimonial {status} successfully", "testimonial_id": testimonial_id, "approved": approval.approved}

@api_router.delete("/admin/inquiry/{inquiry_id}", dependencies=[Depends(verify_admin)])
async def delete_inquiry(inquiry_id: str):
    """Delete a demo inquiry"""
    result = await db.demo_inquiries.delete_one({"id": inquiry_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    logger.info(f"Inquiry {inquiry_id} deleted")
    return {"message": "Inquiry deleted successfully", "inquiry_id": inquiry_id}

@api_router.delete("/admin/testimonial/{testimonial_id}", dependencies=[Depends(verify_admin)])
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    logger.info(f"Testimonial {testimonial_id} deleted")
    return {"message": "Testimonial deleted successfully", "testimonial_id": testimonial_id}

# Blog Endpoints
@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    """Get all published blog posts with optional filtering"""
    query = {"status": "published"}
    
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Convert ISO string timestamps back to datetime objects
    for post in posts:
        if isinstance(post['created_at'], str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        if isinstance(post['updated_at'], str):
            post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    
    return posts

@api_router.get("/blog/posts/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Get a single blog post by slug"""
    post = await db.blog_posts.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Increment view count
    await db.blog_posts.update_one(
        {"slug": slug},
        {"$inc": {"views": 1}}
    )
    
    # Convert ISO string timestamps
    if isinstance(post['created_at'], str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    if isinstance(post['updated_at'], str):
        post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    
    return post

@api_router.get("/blog/categories")
async def get_blog_categories():
    """Get all blog categories with post counts"""
    categories = await db.blog_posts.aggregate([
        {"$match": {"status": "published"}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]).to_list(100)
    
    return [{"name": cat["_id"], "count": cat["count"]} for cat in categories]

@api_router.get("/blog/related/{slug}")
async def get_related_posts(slug: str, limit: int = 3):
    """Get related blog posts based on category and tags"""
    current_post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0, "category": 1, "tags": 1})
    
    if not current_post:
        return []
    
    # Find posts with same category or overlapping tags
    related = await db.blog_posts.find(
        {
            "slug": {"$ne": slug},
            "status": "published",
            "$or": [
                {"category": current_post.get("category")},
                {"tags": {"$in": current_post.get("tags", [])}}
            ]
        },
        {"_id": 0, "id": 1, "title": 1, "slug": 1, "excerpt": 1, "featured_image": 1, "category": 1, "read_time": 1, "created_at": 1}
    ).limit(limit).to_list(limit)
    
    return related

# Admin Blog Endpoints
@api_router.post("/admin/blog/posts", response_model=BlogPost, dependencies=[Depends(verify_admin)])
async def create_blog_post(post: BlogPostCreate):
    """Create a new blog post (Admin only)"""
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post.slug})
    if existing:
        raise HTTPException(status_code=400, detail="A post with this slug already exists")
    
    post_obj = BlogPost(**post.model_dump())
    
    # Convert to dict and serialize datetime
    doc = post_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.blog_posts.insert_one(doc)
    
    logger.info(f"New blog post created: {post_obj.title} ({post_obj.slug})")
    
    return post_obj

@api_router.put("/admin/blog/posts/{post_id}", dependencies=[Depends(verify_admin)])
async def update_blog_post(post_id: str, update: BlogPostUpdate):
    """Update a blog post (Admin only)"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    logger.info(f"Blog post {post_id} updated")
    return {"message": "Blog post updated successfully", "post_id": post_id}

@api_router.delete("/admin/blog/posts/{post_id}", dependencies=[Depends(verify_admin)])
async def delete_blog_post(post_id: str):
    """Delete a blog post (Admin only)"""
    result = await db.blog_posts.delete_one({"id": post_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    logger.info(f"Blog post {post_id} deleted")
    return {"message": "Blog post deleted successfully", "post_id": post_id}

@api_router.get("/admin/blog/posts/all", dependencies=[Depends(verify_admin)])
async def get_all_blog_posts_admin():
    """Get all blog posts including drafts (Admin only)"""
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for post in posts:
        if isinstance(post['created_at'], str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
        if isinstance(post['updated_at'], str):
            post['updated_at'] = datetime.fromisoformat(post['updated_at'])
    
    return posts

# SEO Endpoints
@app.get("/sitemap.xml", response_class=Response)
async def get_sitemap():
    """Generate dynamic XML sitemap"""
    base_url = "https://mathematicsgeek.com"
    
    # Get all pages
    pages = get_static_pages() + get_programmatic_pages()
    
    # Get blog posts from database
    blog_posts = await db.blog_posts.find(
        {"status": "published"}, 
        {"_id": 0, "slug": 1, "updated_at": 1}
    ).to_list(1000)
    
    # Add blog posts to sitemap
    for post in blog_posts:
        pages.append({
            'url': f'/blog/{post["slug"]}',
            'lastmod': post.get('updated_at', datetime.now(timezone.utc).isoformat())[:10],
            'changefreq': 'monthly',
            'priority': '0.7'
        })
    
    sitemap_xml = generate_sitemap_xml(base_url, pages)
    
    return Response(
        content=sitemap_xml,
        media_type="application/xml",
        headers={"Cache-Control": "public, max-age=3600"}
    )

@api_router.get("/seo/schemas")
async def get_seo_schemas():
    """Get all structured data schemas for the website"""
    base_url = "https://mathematicsgeek.com"
    
    return {
        "organization": generate_organization_schema(base_url),
        "course": generate_course_schema(base_url),
        "faq": generate_faq_schema(HOMEPAGE_FAQS)
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()