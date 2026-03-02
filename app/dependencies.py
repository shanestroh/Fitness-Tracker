from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.db import session_local
from app.models.user_table import User
from app.security import jwt_secret_key, jwt_algorithm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl= "/auth/login")

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, jwt_secret_key, algorithms=[jwt_algorithm])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="invalid token")

    user_row = db.query(User).filter(User.email == email).first()
    if not user_row:
        raise HTTPException(status_code=401, detail="user not found")

    return user_row