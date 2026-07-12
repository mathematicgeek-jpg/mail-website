"""Question generation routes."""

from fastapi import APIRouter
from app.services.question_generator import generate_questions, get_available_topics

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.get("/generate")
async def generate(
    topic: str = "mental_math",
    difficulty: int = 2,
    count: int = 10,
):
    """Generate math questions on-the-fly."""
    if difficulty < 1 or difficulty > 5:
        difficulty = 2
    if count < 1 or count > 50:
        count = 10
    questions = generate_questions(topic=topic, difficulty=difficulty, count=count)
    return {"topic": topic, "difficulty": difficulty, "count": len(questions), "questions": questions}


@router.get("/topics")
async def topics():
    """List available question topics."""
    return get_available_topics()
