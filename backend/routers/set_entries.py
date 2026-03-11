from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

from backend.db import session_local
from backend.models.user_table import User
from backend.models.workout_session_table import WorkoutSession
from backend.models.exercise_entry_table import ExerciseEntry
from backend.models.set_entry_table import SetEntry
from backend.schemas.set_entry import CreateSetEntry, UpdateSetEntry

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

def get_owned_set_entry(
    set_id: int,
    db: Session,
    current_user: User,
) -> SetEntry:
    set_row = (
        db.query(SetEntry)
        .join(ExerciseEntry, ExerciseEntry.id == SetEntry.exercise_entry_id)
        .join(WorkoutSession, WorkoutSession.id == ExerciseEntry.session_id)
        .filter(SetEntry.id == set_id, WorkoutSession.user_id == current_user.id)
        .first()
    )
    if set_row is None:
        raise HTTPException(status_code=404, detail="Set Entry Not Found")
    return set_row

@router.post("/exercises/{exercise_entry_id}/sets")
def create_set_entry(
        exercise_entry_id: int,
        set_data: CreateSetEntry,
        db: Session = Depends(get_db),
):
    exercise_row = (
        db.query(ExerciseEntry)
        .join(WorkoutSession, WorkoutSession.id == ExerciseEntry.session_id)
        .filter(
            ExerciseEntry.id == exercise_entry_id,
            WorkoutSession.user_id == 1,
        )
        .first()
    )
    if exercise_row is None:
        raise HTTPException(status_code=404, detail="Exercise Entry Not Found")

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

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail = "Set Number Conflict")
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

@router.delete("/sets/{set_id}")
def delete_set_entry(
    set_id: int,
    db: Session = Depends(get_db),
):
    set_row = (
        db.query(SetEntry)
        .join(ExerciseEntry, ExerciseEntry.id == SetEntry.exercise_entry_id)
        .join(WorkoutSession, WorkoutSession.id == ExerciseEntry.session_id)
        .filter(SetEntry.id == set_id, WorkoutSession.user_id == 1)
        .first()
    )
    if set_row is None:
        raise HTTPException(status_code=404, detail="Set Entry Not Found")

    db.delete(set_row)
    db.commit()

    return {"deleted": True, "set_id": set_id}

@router.patch("/sets/{set_id}")
def update_set_entry(
    set_id: int,
    payload: UpdateSetEntry,
    db: Session = Depends(get_db),
):
    set_row = (
        db.query(SetEntry)
        .join(ExerciseEntry, ExerciseEntry.id == SetEntry.exercise_entry_id)
        .join(WorkoutSession, WorkoutSession.id == ExerciseEntry.session_id)
        .filter(SetEntry.id == set_id, WorkoutSession.user_id == 1)
        .first()
    )
    if set_row is None:
        raise HTTPException(status_code=404, detail="Set Entry Not Found")

    data = payload.model_dump(exclude_unset=True)
    #Optional: if you used Optional fields defaulting to None, also exclude None:
    data = {k: v for k, v in data.items() if v is not None}

    if not data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    for field, value in data.items():
        setattr(set_row, field, value)

    db.commit()
    db.refresh(set_row)

    return {
        "id": set_row.id,
        "exercise_entry_id": set_row.exercise_entry_id,
        "set_number": set_row.set_number,
        "reps": set_row.reps,
        "weight": set_row.weight,
        "time_seconds": set_row.time_seconds,
        "intensity": set_row.intensity,
    }