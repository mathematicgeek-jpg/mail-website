"""Auth routes — login, token generation."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import secrets
from app.config import get_settings
from app.utils.security import create_access_token, verify_password
from app.database import get_db

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


@router.post("/student/login", response_model=TokenResponse)
async def student_login(request: LoginRequest):
    """Student login — returns JWT token."""
    db = get_db()
    user = await db.users.find_one({"email": request.username.lower()})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(request.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.get("status") != "active":
        raise HTTPException(status_code=403, detail="Account is not active. Please wait for admin approval.")

    # Convert object id or string id to string for subject
    user_id = str(user.get("id", user.get("_id")))
    
    token = create_access_token(data={
        "sub": user_id, 
        "email": user["email"],
        "role": user.get("role", "student")
    })
    
    return TokenResponse(access_token=token)
