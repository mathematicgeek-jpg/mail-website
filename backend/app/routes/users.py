"""User/Student management routes."""

from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User, UserCreate, UserUpdate, UserResponse
from app.utils.security import get_current_admin, get_current_user, get_password_hash

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserResponse)
async def create_user(user: UserCreate, _: str = Depends(get_current_admin)):
    """Create a new user/student (Admin only)."""
    db = get_db()
    
    # Check if email exists
    existing = await db.users.find_one({"email": user.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    
    new_user = User(
        name=user.name,
        email=user.email.lower(),
        phone=user.phone,
        hashed_password=hashed_password,
        student_class=user.student_class,
        board=user.board,
        role=user.role,
        status="active"
    )
    
    doc = new_user.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    doc["updated_at"] = doc["updated_at"].isoformat()
    
    await db.users.insert_one(doc)
    
    return UserResponse(**doc)


@router.get("", response_model=List[UserResponse])
async def list_users(_: str = Depends(get_current_admin)):
    """List all users (Admin only)."""
    db = get_db()
    users = await db.users.find({}, {"hashed_password": 0, "_id": 0}).sort("created_at", -1).to_list(1000)
    for u in users:
        for field in ["created_at", "updated_at"]:
            if isinstance(u.get(field), str):
                u[field] = datetime.fromisoformat(u[field])
    return users


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user profile."""
    db = get_db()
    user_id = current_user.get("sub")
    user = await db.users.find_one({"id": user_id}, {"hashed_password": 0, "_id": 0})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    for field in ["created_at", "updated_at"]:
        if isinstance(user.get(field), str):
            user[field] = datetime.fromisoformat(user[field])
            
    return UserResponse(**user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, update_data: UserUpdate, _: str = Depends(get_current_admin)):
    """Update a user (Admin only)."""
    db = get_db()
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
        
    if "password" in update_dict:
        update_dict["hashed_password"] = get_password_hash(update_dict.pop("password"))
        
    if "email" in update_dict:
        update_dict["email"] = update_dict["email"].lower()
        
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        # Might just be the same data, verify user exists
        user = await db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
    updated_user = await db.users.find_one({"id": user_id}, {"hashed_password": 0, "_id": 0})
    for field in ["created_at", "updated_at"]:
        if isinstance(updated_user.get(field), str):
            updated_user[field] = datetime.fromisoformat(updated_user[field])
            
    return UserResponse(**updated_user)
