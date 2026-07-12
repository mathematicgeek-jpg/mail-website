"""Game engine models."""

from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import uuid


# --- Game Templates ---

class GameTemplateConfig(BaseModel):
    time_limit: int = 60  # seconds
    question_count: int = 10
    difficulty_min: int = 1
    difficulty_max: int = 5
    topics: List[str] = []
    operations: List[str] = ["addition", "subtraction", "multiplication", "division"]


class GameTemplateCreate(BaseModel):
    name: str
    type: str  # mental_math, timed_quiz, vedic_tricks, daily_challenge
    description: str = ""
    config: GameTemplateConfig = GameTemplateConfig()
    topic: str = "general"
    class_range: List[int] = [6, 7, 8, 9, 10, 11, 12]


class GameTemplate(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str
    description: str = ""
    config: GameTemplateConfig = GameTemplateConfig()
    topic: str = "general"
    class_range: List[int] = [6, 7, 8, 9, 10, 11, 12]
    created_by: str = ""
    active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Game Sessions ---

class AnswerSubmission(BaseModel):
    question_id: str
    answer: str
    time_taken: float  # seconds for this question


class GameSessionCreate(BaseModel):
    template_id: str
    player_name: str = "Anonymous"


class GameSession(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    template_id: str
    user_id: str = ""
    player_name: str = "Anonymous"
    assigned_by: str = ""
    score: int = 0
    total: int = 0
    time_taken: float = 0
    answers: List[Dict[str, Any]] = []
    streak: int = 0
    best_streak: int = 0
    xp_earned: int = 0
    status: str = "active"  # active, completed, abandoned
    questions: List[Dict[str, Any]] = []  # questions served in this session
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None


# --- User Progress ---

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    player_name: str = "Anonymous"
    total_xp: int = 0
    level: int = 1
    games_played: int = 0
    total_correct: int = 0
    total_answered: int = 0
    streak_best: int = 0
    daily_streak: int = 0
    topic_scores: Dict[str, Dict[str, int]] = {}  # {"algebra": {"correct": 10, "total": 15}}
    badges: List[str] = []
    last_played: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Leaderboard ---

class LeaderboardEntry(BaseModel):
    rank: int
    player_name: str
    score: int
    total_xp: int = 0
    level: int = 1
    games_played: int = 0
