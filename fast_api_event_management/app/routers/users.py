from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema, UserUpdate, UserWithEvents
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "User not found"}}
)

def get_password_hash(password: str) -> str:
    """Generate a hashed password"""
    return pwd_context.hash(password)

@router.post("/", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a new user
    """
    # Check if email already exists
    db_user_email = db.query(User).filter(User.email == user.email).first()
    if db_user_email:
        raise HTTPException(
            status_code=400, 
            detail="Email already registered"
        )
    
    # Check if username already exists
    db_user_username = db.query(User).filter(User.username == user.username).first()
    if db_user_username:
        raise HTTPException(
            status_code=400, 
            detail="Username already taken"
        )
    
    # Create new user
    user_data = user.model_dump()
    hashed_password = get_password_hash(user_data.pop("password"))
    
    db_user = User(**user_data, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.get("/", response_model=List[UserSchema])
async def read_users(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve users
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=UserWithEvents)
async def read_user(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Get a specific user by ID
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: int, 
    user: UserUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update a user
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update only the fields that are provided
    update_data = user.model_dump(exclude_unset=True)
    
    # Hash password if it was provided
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a user
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    return None

@router.get("/{user_id}/events", response_model=List[dict])
async def get_user_events(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all events created by a specific user
    """
    # Check if user exists
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get events
    return db_user.events
