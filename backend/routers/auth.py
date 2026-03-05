from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from backend.db import session_local
from backend.models.user_table import User
from backend.schemas.auth import UserCreate, UserLogin
from backend.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix = "/auth", tags = ["Authentication"])

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="email already registered")

    user_row = User(
        email = user_data.email,
        password_hash = hash_password(user_data.password)
    )
    db.add(user_row)
    db.commit()
    db.refresh(user_row)

    return {"id": user_row.id, "email": user_row.email}

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_row = db.query(User).filter(User.email == form_data.username).first()

    if not user_row or not verify_password(form_data.password, user_row.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")

    if not verify_password(form_data.password, user_row.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")

    access_token = create_access_token(subject=user_row.email)
    return {"access_token": access_token, "token_type": "bearer"}