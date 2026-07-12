"""
Game engine service — handles game sessions, scoring, XP, and leaderboards.
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.database import get_db
from app.services.question_generator import generate_questions


# XP configuration
XP_PER_CORRECT = 10
XP_STREAK_BONUS = 5  # extra XP per streak question
XP_SPEED_BONUS = 3   # extra XP for fast answers (< 5 seconds)
XP_PER_LEVEL = 100

LEVEL_TITLES = {
    1: "Math Beginner",
    2: "Number Explorer",
    3: "Calculation Cadet",
    4: "Math Apprentice",
    5: "Speed Calculator",
    6: "Number Ninja",
    7: "Math Warrior",
    8: "Vedic Scholar",
    9: "Math Champion",
    10: "Mathematics Geek",
}


async def create_game_session(template_id: str, player_name: str = "Anonymous") -> Dict[str, Any]:
    """Create a new game session from a template."""
    db = get_db()

    # Get template
    template = await db.game_templates.find_one({"id": template_id, "active": True}, {"_id": 0})
    if not template:
        return None

    config = template.get("config", {})
    topic = template.get("topic", "mental_math")

    # Pick a random topic from config topics if available
    topics = config.get("topics", [topic])
    selected_topic = topics[0] if topics else topic

    # Generate questions
    questions = generate_questions(
        topic=selected_topic,
        difficulty=config.get("difficulty_min", 2),
        count=config.get("question_count", 10),
        include_options=True,
    )

    from uuid import uuid4

    session = {
        "id": str(uuid4()),
        "template_id": template_id,
        "player_name": player_name,
        "score": 0,
        "total": len(questions),
        "time_taken": 0,
        "answers": [],
        "streak": 0,
        "best_streak": 0,
        "xp_earned": 0,
        "status": "active",
        "questions": questions,
        "time_limit": config.get("time_limit", 60),
        "started_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": None,
    }

    await db.game_sessions.insert_one({**session, "_id": None})
    # Remove _id before returning
    session.pop("_id", None)

    return session


async def submit_answer(session_id: str, question_id: str, answer: str, time_taken: float) -> Dict[str, Any]:
    """Submit an answer for a game session question."""
    db = get_db()

    session = await db.game_sessions.find_one({"id": session_id, "status": "active"}, {"_id": 0})
    if not session:
        return {"error": "Session not found or already completed"}

    # Find the question
    question = None
    for q in session.get("questions", []):
        if q["id"] == question_id:
            question = q
            break

    if not question:
        return {"error": "Question not found"}

    # Check answer
    is_correct = str(answer).strip() == str(question["correct_answer"]).strip()

    # Calculate XP
    xp = 0
    new_streak = session.get("streak", 0)
    if is_correct:
        xp = XP_PER_CORRECT
        new_streak += 1
        if new_streak > 1:
            xp += XP_STREAK_BONUS * (new_streak - 1)
        if time_taken < 5:
            xp += XP_SPEED_BONUS
    else:
        new_streak = 0

    best_streak = max(session.get("best_streak", 0), new_streak)

    answer_record = {
        "question_id": question_id,
        "answer": answer,
        "correct_answer": question["correct_answer"],
        "is_correct": is_correct,
        "time_taken": time_taken,
        "xp_earned": xp,
    }

    # Update session
    new_score = session.get("score", 0) + (1 if is_correct else 0)
    new_xp = session.get("xp_earned", 0) + xp
    total_time = session.get("time_taken", 0) + time_taken

    answers_submitted = session.get("answers", [])
    answers_submitted.append(answer_record)

    update_data = {
        "score": new_score,
        "xp_earned": new_xp,
        "streak": new_streak,
        "best_streak": best_streak,
        "time_taken": total_time,
        "answers": answers_submitted,
    }

    # Check if all questions answered
    if len(answers_submitted) >= session.get("total", 0):
        update_data["status"] = "completed"
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()

    await db.game_sessions.update_one({"id": session_id}, {"$set": update_data})

    return {
        "is_correct": is_correct,
        "correct_answer": question["correct_answer"],
        "explanation": question.get("explanation", ""),
        "xp_earned": xp,
        "streak": new_streak,
        "score": new_score,
        "total_answered": len(answers_submitted),
        "total_questions": session.get("total", 0),
        "session_complete": update_data.get("status") == "completed",
    }


async def complete_session(session_id: str) -> Dict[str, Any]:
    """Mark a session as complete and update user progress."""
    db = get_db()

    session = await db.game_sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        return {"error": "Session not found"}

    if session.get("status") != "completed":
        await db.game_sessions.update_one(
            {"id": session_id},
            {"$set": {"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}},
        )

    # Update leaderboard / user progress
    player_name = session.get("player_name", "Anonymous")
    if player_name != "Anonymous":
        progress = await db.user_progress.find_one({"player_name": player_name}, {"_id": 0})

        if progress:
            new_xp = progress.get("total_xp", 0) + session.get("xp_earned", 0)
            new_level = (new_xp // XP_PER_LEVEL) + 1

            await db.user_progress.update_one(
                {"player_name": player_name},
                {
                    "$set": {
                        "total_xp": new_xp,
                        "level": new_level,
                        "streak_best": max(progress.get("streak_best", 0), session.get("best_streak", 0)),
                        "last_played": datetime.now(timezone.utc).isoformat(),
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    },
                    "$inc": {
                        "games_played": 1,
                        "total_correct": session.get("score", 0),
                        "total_answered": session.get("total", 0),
                    },
                },
            )
        else:
            from uuid import uuid4

            new_xp = session.get("xp_earned", 0)
            await db.user_progress.insert_one(
                {
                    "id": str(uuid4()),
                    "user_id": "",
                    "player_name": player_name,
                    "total_xp": new_xp,
                    "level": (new_xp // XP_PER_LEVEL) + 1,
                    "games_played": 1,
                    "total_correct": session.get("score", 0),
                    "total_answered": session.get("total", 0),
                    "streak_best": session.get("best_streak", 0),
                    "daily_streak": 1,
                    "topic_scores": {},
                    "badges": [],
                    "last_played": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            )

    return {
        "session_id": session_id,
        "score": session.get("score", 0),
        "total": session.get("total", 0),
        "xp_earned": session.get("xp_earned", 0),
        "best_streak": session.get("best_streak", 0),
        "time_taken": session.get("time_taken", 0),
        "status": "completed",
    }


async def get_leaderboard(limit: int = 20) -> List[Dict[str, Any]]:
    """Get global leaderboard sorted by XP."""
    db = get_db()

    entries = (
        await db.user_progress.find({}, {"_id": 0})
        .sort("total_xp", -1)
        .limit(limit)
        .to_list(limit)
    )

    leaderboard = []
    for i, entry in enumerate(entries, 1):
        leaderboard.append(
            {
                "rank": i,
                "player_name": entry.get("player_name", "Anonymous"),
                "total_xp": entry.get("total_xp", 0),
                "level": entry.get("level", 1),
                "level_title": LEVEL_TITLES.get(min(entry.get("level", 1), 10), "Math Legend"),
                "games_played": entry.get("games_played", 0),
                "accuracy": round(
                    (entry.get("total_correct", 0) / max(entry.get("total_answered", 1), 1)) * 100,
                    1,
                ),
            }
        )

    return leaderboard


async def seed_default_templates():
    """Seed default game templates if none exist."""
    db = get_db()

    count = await db.game_templates.count_documents({})
    if count > 0:
        return

    from uuid import uuid4

    templates = [
        {
            "id": str(uuid4()),
            "name": "Mental Math Sprint",
            "type": "mental_math",
            "description": "Race against the clock! Solve mental math problems as fast as you can.",
            "config": {
                "time_limit": 60,
                "question_count": 10,
                "difficulty_min": 2,
                "difficulty_max": 3,
                "topics": ["mental_math"],
                "operations": ["addition", "subtraction", "multiplication"],
            },
            "topic": "mental_math",
            "class_range": [6, 7, 8, 9, 10],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid4()),
            "name": "Vedic Math Challenge",
            "type": "vedic_tricks",
            "description": "Master Vedic mathematics techniques with these specially crafted problems.",
            "config": {
                "time_limit": 120,
                "question_count": 10,
                "difficulty_min": 2,
                "difficulty_max": 4,
                "topics": ["vedic_multiplication", "vedic_squares"],
                "operations": [],
            },
            "topic": "vedic_multiplication",
            "class_range": [7, 8, 9, 10, 11, 12],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid4()),
            "name": "Speed Multiplication",
            "type": "timed_quiz",
            "description": "How fast can you multiply? Test your multiplication speed!",
            "config": {
                "time_limit": 90,
                "question_count": 15,
                "difficulty_min": 1,
                "difficulty_max": 3,
                "topics": ["multiplication"],
                "operations": ["multiplication"],
            },
            "topic": "multiplication",
            "class_range": [6, 7, 8, 9],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid4()),
            "name": "Algebra Ace",
            "type": "timed_quiz",
            "description": "Solve linear equations and algebraic expressions.",
            "config": {
                "time_limit": 120,
                "question_count": 10,
                "difficulty_min": 2,
                "difficulty_max": 4,
                "topics": ["algebra"],
                "operations": [],
            },
            "topic": "algebra",
            "class_range": [8, 9, 10, 11, 12],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid4()),
            "name": "Percentage Pro",
            "type": "mental_math",
            "description": "Master percentages — essential for real life and exams!",
            "config": {
                "time_limit": 90,
                "question_count": 10,
                "difficulty_min": 1,
                "difficulty_max": 3,
                "topics": ["percentages"],
                "operations": [],
            },
            "topic": "percentages",
            "class_range": [7, 8, 9, 10],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid4()),
            "name": "Daily Challenge",
            "type": "daily_challenge",
            "description": "Today's math challenge — new problems every day!",
            "config": {
                "time_limit": 180,
                "question_count": 5,
                "difficulty_min": 3,
                "difficulty_max": 5,
                "topics": ["mental_math", "vedic_multiplication", "algebra", "squares"],
                "operations": [],
            },
            "topic": "mental_math",
            "class_range": [6, 7, 8, 9, 10, 11, 12],
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    await db.game_templates.insert_many(templates)
