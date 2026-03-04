from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db import session_local
from app.dependencies import get_current_user
from app.models.user_table import User
from app.models.workout_session_table import WorkoutSession
from app.models.exercise_entry_table import ExerciseEntry
from app.models.set_entry_table import SetEntry
from app.schemas.set_entry import CreateSetEntry

router = APIRouter(tags=["Set Entries"])

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

"""
Ownership check:
ExerciseEntry > WorkoutSession > User
Ensures users can only access sets for exercises inside their own sessions
"""
def get_owned_exercise_entry(
        exercise_entry_id: int,
        db: Session,
        current_user: User,
) -> ExerciseEntry:
    exercise_row = (
        db.query(ExerciseEntry)
        .join(WorkoutSession, WorkoutSession.id == ExerciseEntry.session_id)
        .filter(
            ExerciseEntry.id == exercise_entry_id,
            WorkoutSession.user_id == current_user.id,
        )
        .first()
    )
    if exercise_row is None:
        raise HTTPException(status_code=404, detail="Exercise Entry Not Found")
    return exercise_row

@router.post("/exercises/{exercise_entry_id}/sets")
def create_set_entry(
        exercise_entry_id: int,
        set_data: CreateSetEntry,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):

    #Ensure exercise entry belongs to current user
    _ = get_owned_exercise_entry(exercise_entry_id, db, current_user)

    #Auto-assign set number if not provided
    max_set_number = (
        db.query(func.max(SetEntry.set_number))
        .filter(SetEntry.exercise_entry_id == exercise_entry_id)
        .scalar()
    )

    next_set_number = 1 if max_set_number is None else max_set_number + 1

    set_row = SetEntry(
        exercise_entry_id=exercise_entry_id,
        set_number=next_set_number,
        reps=set_data.reps,
        weight=set_data.weight,
        time_seconds=set_data.time_seconds,
        intensity=set_data.intensity,
    )
    db.add(set_row)
    db.commit()
    db.refresh(set_row)

    record = {
        #"id": set_row.id,
        "exercise_entry_id": set_row.exercise_entry_id,
        "set_number": set_row.set_number,
        "reps": set_row.reps,
        "weight": set_row.weight,
        "time_seconds": set_row.time_seconds,
        "intensity": set_row.intensity,
    }
    return {k: v for k, v in record.items() if v is not None}
