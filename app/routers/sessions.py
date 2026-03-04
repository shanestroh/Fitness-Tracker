from fastapi import APIRouter, Depends, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session

from app.db import session_local
from app.dependencies import get_current_user
from app.models.user_table import User
from app.models.workout_session_table import WorkoutSession
from app.schemas.session import CreateSession

router = APIRouter(tags = ["Sessions"])

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()
@router.post("/Sessions")
def create_session(
        session_data: CreateSession,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    session_row = WorkoutSession(
        user_id = current_user.id,
        date = session_data.date,
        split = session_data.split,
        notes = session_data.notes,
    )
    db.add(session_row)
    db.commit()
    db.refresh(session_row)

    record = {
        "id": session_row.id,
        "date": session_row.date,
        "split": session_row.split,
        "notes": session_row.notes,
    }
    return {k: v for k, v in record.items() if v is not None}

@router.get("/Sessions")
def get_sessions(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    session_rows = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == current_user.id)
        .order_by(WorkoutSession.date.desc(), WorkoutSession.id.desc())
        .all()
    )

    results = []
    for row in session_rows:
        record = {
            "id": row.id,
            "date": row.date,
            "split": row.split,
            "notes": row.notes,
        }
        results.append({k:v for k, v in record.items() if v is not None})
    return results