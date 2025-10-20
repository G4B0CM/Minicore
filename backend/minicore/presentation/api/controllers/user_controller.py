from fastapi import APIRouter, HTTPException, status
from typing import List
from backend.minicore.core.models.user import User
from backend.minicore.infrastructure.database import db

router = APIRouter()

@router.get("/", response_model=List[User], status_code=status.HTTP_200_OK)
def get_users() -> List[User]:
    return db.get_users()

@router.get("/{user_id}", response_model=User, status_code=status.HTTP_200_OK)
def get_user(user_id: int) -> User | None:
    user = db.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user