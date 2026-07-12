"""Auth routes — login, token generation."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import secrets
from app.config import get_settings
from app.utils.security import create_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Admin login — returns JWT token."""
    settings = get_settings()
    correct_user = secrets.compare_digest(request.username, settings.ADMIN_USERNAME)
    correct_pass = secrets.compare_digest(request.password, settings.ADMIN_PASSWORD)

    if not (correct_user and correct_pass):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": request.username, "role": "admin"})
    return TokenResponse(access_token=token)
