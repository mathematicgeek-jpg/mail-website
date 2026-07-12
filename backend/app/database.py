"""
MongoDB connection manager with lifecycle hooks.
"""

from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import get_settings

_client: Optional[AsyncIOMotorClient] = None
_db: Optional[AsyncIOMotorDatabase] = None


async def connect_db():
    """Initialize MongoDB connection and create indexes."""
    global _client, _db
    settings = get_settings()
    _client = AsyncIOMotorClient(settings.MONGO_URL)
    _db = _client[settings.DB_NAME]

    # Create indexes for performance
    await _db.leads.create_index("status")
    await _db.leads.create_index("created_at")
    await _db.leads.create_index("phone", unique=True, sparse=True)

    await _db.blog_posts.create_index("slug", unique=True)
    await _db.blog_posts.create_index("status")
    await _db.blog_posts.create_index("category")
    await _db.blog_posts.create_index([("tags", 1)])

    await _db.testimonials.create_index("approved")

    await _db.game_templates.create_index("active")
    await _db.game_templates.create_index("topic")

    await _db.game_sessions.create_index("user_id")
    await _db.game_sessions.create_index("template_id")
    await _db.game_sessions.create_index([("score", -1)])

    await _db.user_progress.create_index("user_id", unique=True)
    await _db.user_progress.create_index([("total_xp", -1)])

    await _db.questions.create_index("topic")
    await _db.questions.create_index("difficulty")
    await _db.questions.create_index([("topic", 1), ("difficulty", 1)])

    await _db.whatsapp_conversations.create_index("phone", unique=True)


async def close_db():
    """Close MongoDB connection."""
    global _client
    if _client:
        _client.close()


def get_db() -> AsyncIOMotorDatabase:
    """Get database instance for dependency injection."""
    if _db is None:
        raise RuntimeError("Database not initialized. Call connect_db() first.")
    return _db
