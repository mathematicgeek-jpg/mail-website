"""SEO routes — sitemap, structured data schemas."""

from fastapi import APIRouter
from fastapi.responses import Response
from datetime import datetime, timezone
from app.database import get_db
from app.config import get_settings

# Import migrated SEO utilities
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from seo_utils import (
    generate_sitemap_xml,
    get_static_pages,
    get_programmatic_pages,
    generate_organization_schema,
    generate_course_schema,
    generate_faq_schema,
    HOMEPAGE_FAQS,
)

router = APIRouter(tags=["seo"])


@router.get("/sitemap.xml", response_class=Response)
async def get_sitemap():
    """Generate dynamic XML sitemap."""
    settings = get_settings()
    pages = get_static_pages() + get_programmatic_pages()

    # Add blog posts
    db = get_db()
    blog_posts = await db.blog_posts.find(
        {"status": "published"}, {"_id": 0, "slug": 1, "updated_at": 1}
    ).to_list(1000)

    for post in blog_posts:
        pages.append({
            "url": f'/blog/{post["slug"]}',
            "lastmod": str(post.get("updated_at", datetime.now(timezone.utc).isoformat()))[:10],
            "changefreq": "monthly",
            "priority": "0.7",
        })

    sitemap_xml = generate_sitemap_xml(settings.SITE_URL, pages)
    return Response(content=sitemap_xml, media_type="application/xml", headers={"Cache-Control": "public, max-age=3600"})


@router.get("/api/seo/schemas")
async def get_seo_schemas():
    """Get all structured data schemas."""
    settings = get_settings()
    return {
        "organization": generate_organization_schema(settings.SITE_URL),
        "course": generate_course_schema(settings.SITE_URL),
        "faq": generate_faq_schema(HOMEPAGE_FAQS),
    }
