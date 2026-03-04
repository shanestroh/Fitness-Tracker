from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import session_local
from app.dependencies import get_current_user
from app.models.user_table import User
from app.models.workout_session_table import WorkoutSession
from app.models.exercise_entry_table import ExerciseEntry
from app.schemas.exercise_entry import CreateExerciseEntry

router = APIRouter(tags=["Exercise Entries"])

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()

@router.post("/sessions/{session_id}/exercises")
def create_exercise_entry(
        session_id: int,
        exercise_data: CreateExerciseEntry,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):

    #Ensures session exists and belongs to a user
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail="Workout Session Not Found")

    max_index = (
        db.query(ExerciseEntry.order_index)
        .filter(ExerciseEntry.session_id == session_id, ExerciseEntry.order_index.isnot(None))
        .order_by(ExerciseEntry.order_index.desc())
        .first()
    )

    if exercise_data.order_index is None:
        if max_index is None or max_index[0] is None:
            next_index = 1
        else:
            next_index = max_index[0] + 1
    else:
        next_index = exercise_data.order_index

    exercise_row = ExerciseEntry(
        session_id = session_id,
        exercise = exercise_data.exercise,
        order_index = next_index,
    )
    db.add(exercise_row)
    db.commit()
    db.refresh(exercise_row)

    record = {
        "id": exercise_row.id,
        "session_id": exercise_row.session_id,
        "exercise": exercise_row.exercise,
        "order_index": exercise_row.order_index,
    }
    return {k: v for k, v in record.items() if v is not None}

@router.get("/sessions/{session_id}/exercises")
def get_exercise_entries(
        session_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail="Workout Session not Found")
    exercise_rows = (
        db.query(ExerciseEntry)
        .filter(ExerciseEntry.session_id == session_id)
        .order_by(ExerciseEntry.order_index.asc().nulls_last(), ExerciseEntry.id.asc())
        .all()
    )
    results = []
    for row in exercise_rows:
        record = {
            "id": row.id,
            "session_id": row.session_id,
            "exercise": row.exercise,
            "order_index": row.order_index,
        }
        results.append({k: v for k, v in record.items() if v is not None})
    return results