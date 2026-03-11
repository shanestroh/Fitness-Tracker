import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import Header, HTTPException

from backend.db import session_local

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

def verify_api_key(x_api_key: str | None = Header(default=None)):
    api_key = os.getenv("API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="API key not configured")

    if x_api_key != api_key:
        raise HTTPException(status_code=403, detail="Forbidden")