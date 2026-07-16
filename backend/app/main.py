"""
Mathematics Geek — FastAPI Application
Main entry point with router registration and lifecycle hooks.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import logging

from app.config import get_settings
from app.database import connect_db, close_db
from app.services.game_engine import seed_default_templates

# Import routers
from app.routes import auth, inquiries, testimonials, blog, games, questions, whatsapp, seo, users

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle — startup and shutdown hooks."""
    # Startup
    logger.info("🚀 Starting Mathematics Geek API...")
    await connect_db()
    await seed_default_templates()
    logger.info("✅ Database connected, templates seeded")
    yield
    # Shutdown
    logger.info("🛑 Shutting down...")
    await close_db()


app = FastAPI(
    title="Mathematics Geek API",
    description="Backend API for Mathematics Geek — Vedic Math learning platform with gamification",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.cors_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(inquiries.router)
app.include_router(testimonials.router)
app.include_router(blog.router)
app.include_router(games.router)
app.include_router(questions.router)
app.include_router(whatsapp.router)
app.include_router(seo.router)
app.include_router(users.router)


@app.get("/api")
async def root():
    return {
        "name": "Mathematics Geek API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/admin/dashboard-stats")
async def dashboard_stats():
    """Combined dashboard statistics."""
    from app.database import get_db

    db = get_db()

    total_leads = await db.leads.count_documents({})
    pending_leads = await db.leads.count_documents({"status": "pending"})
    contacted = await db.leads.count_documents({"status": "contacted"})
    enrolled = await db.leads.count_documents({"status": "enrolled"})

    total_testimonials = await db.testimonials.count_documents({})
    approved_testimonials = await db.testimonials.count_documents({"approved": True})

    total_blog = await db.blog_posts.count_documents({})
    published_blog = await db.blog_posts.count_documents({"status": "published"})

    total_games = await db.game_sessions.count_documents({})
    total_players = await db.user_progress.count_documents({})

    return {
        "leads": {"total": total_leads, "pending": pending_leads, "contacted": contacted, "enrolled": enrolled},
        "testimonials": {"total": total_testimonials, "approved": approved_testimonials, "pending": total_testimonials - approved_testimonials},
        "blog": {"total": total_blog, "published": published_blog, "drafts": total_blog - published_blog},
        "games": {"total_sessions": total_games, "total_players": total_players},
    }
