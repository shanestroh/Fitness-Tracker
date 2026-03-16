from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.dependencies import get_db
from backend.models.set_entry_table import SetEntry
from backend.models.workout_session_table import WorkoutSession
from backend.models.exercise_entry_table import ExerciseEntry
from backend.schemas.exercise_entry import CreateExerciseEntry, UpdateExerciseEntry

router = APIRouter(tags=["Exercise Entries"])




@router.post("/sessions/{session_id}/exercises")
def create_exercise_entry(
        session_id: int,
        exercise_data: CreateExerciseEntry,
        db: Session = Depends(get_db),
):
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == 1)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail="Workout Session Not Found")

    max_index = (
        db.query(ExerciseEntry.order_index)
        .filter(
            ExerciseEntry.session_id == session_id,
            ExerciseEntry.order_index.isnot(None),
        )
        .order_by(ExerciseEntry.order_index.desc())
        .first()
    )

    if max_index is None or max_index[0] is None:
        next_index = 1
    else:
        next_index = max_index[0] + 1

    exercise_row = ExerciseEntry(
        session_id=session_id,
        exercise=exercise_data.exercise,
        exercise_type=exercise_data.exercise_type,
        order_index=next_index,
    )

    db.add(exercise_row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Exercise Order Conflict")

    db.refresh(exercise_row)

    record = {
        "id": exercise_row.id,
        "session_id": exercise_row.session_id,
        "exercise": exercise_row.exercise,
        "exercise_type": exercise_row.exercise_type,
        "order_index": exercise_row.order_index,
    }
    return {k: v for k, v in record.items() if v is not None}


@router.patch("/exercises/{exercise_entry_id}")
def update_exercise_entry(
        exercise_entry_id: int,
        payload: UpdateExerciseEntry,
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

    data = payload.model_dump(exclude_unset=True)
    data = {k: v for k, v in data.items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail = "No Fields Provided To Update")

    for field, value in data.items():
        setattr(exercise_row, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Exercise order_index conflict")
    db.refresh(exercise_row)

    record = {
        "id": exercise_row.id,
        "session_id": exercise_row.session_id,
        "exercise": exercise_row.exercise,
        "exercise_type": exercise_row.exercise_type,
        "order_index": exercise_row.order_index,
    }
    return {k: v for k, v in record.items() if v is not None}

@router.delete("/exercises/{exercise_entry_id}")
def delete_exercise_entry(
        exercise_entry_id: int,
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

    #Delete sets for this exercise
    db.query(SetEntry).filter(SetEntry.exercise_entry_id == exercise_entry_id).delete()

    #Delete exercise entry
    db.delete(exercise_row)
    db.commit()

    return {"deleted": True, "exercise_entry_id": exercise_entry_id}
