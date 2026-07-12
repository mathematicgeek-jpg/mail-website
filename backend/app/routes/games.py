"""Game routes — templates, sessions, leaderboard."""

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.database import get_db
from app.models.game import GameTemplateCreate, GameTemplate, GameSessionCreate
from app.services.game_engine import (
    create_game_session,
    submit_answer,
    complete_session,
    get_leaderboard,
    seed_default_templates,
)
from app.services.question_generator import get_available_topics
from app.utils.security import get_current_admin

router = APIRouter(prefix="/api/games", tags=["games"])


@router.get("/templates")
async def list_templates(topic: Optional[str] = None):
    """Get available game templates (public)."""
    db = get_db()
    query = {"active": True}
    if topic:
        query["topic"] = topic
    templates = await db.game_templates.find(query, {"_id": 0}).to_list(100)
    return templates


@router.get("/topics")
async def list_topics():
    """Get all available math topics for question generation."""
    return get_available_topics()


@router.post("/start")
async def start_game(data: GameSessionCreate):
    """Start a new game session."""
    session = await create_game_session(data.template_id, data.player_name)
    if not session:
        raise HTTPException(status_code=404, detail="Game template not found")

    # Return session without full answers (prevent cheating)
    safe_questions = []
    for q in session.get("questions", []):
        safe_questions.append({
            "id": q["id"],
            "text": q["text"],
            "options": q.get("options", []),
            "topic": q.get("topic", ""),
            "difficulty": q.get("difficulty", 1),
        })

    return {
        "session_id": session["id"],
        "template_id": session["template_id"],
        "player_name": session["player_name"],
        "questions": safe_questions,
        "time_limit": session.get("time_limit", 60),
        "total": session["total"],
    }


@router.post("/answer")
async def submit_game_answer(
    session_id: str,
    question_id: str,
    answer: str,
    time_taken: float = 10.0,
):
    """Submit an answer for a question in an active game session."""
    result = await submit_answer(session_id, question_id, answer, time_taken)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.post("/complete/{session_id}")
async def complete_game(session_id: str):
    """Complete a game session and update progress."""
    result = await complete_session(session_id)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get game session details."""
    db = get_db()
    session = await db.game_sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/leaderboard")
async def leaderboard(limit: int = 20):
    """Get global leaderboard."""
    return await get_leaderboard(limit)


@router.post("/seed-templates")
async def seed_templates(_: str = Depends(get_current_admin)):
    """Seed default game templates (admin only)."""
    await seed_default_templates()
    return {"message": "Default templates seeded"}


# Admin endpoints
@router.post("/admin/templates", response_model=GameTemplate)
async def create_template(data: GameTemplateCreate, _: str = Depends(get_current_admin)):
    """Create a new game template (admin/teacher only)."""
    db = get_db()
    template = GameTemplate(**data.model_dump())
    doc = template.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.game_templates.insert_one(doc)
    return template
