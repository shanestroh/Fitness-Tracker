from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.db import session_local
from backend.dependencies import get_current_user
from backend.models.user_table import User
from backend.models.workout_session_table import WorkoutSession
from backend.schemas.session import CreateSession, UpdateSession
from backend.models.exercise_entry_table import ExerciseEntry
from backend.models.set_entry_table import SetEntry

router = APIRouter(tags = ["Workout Sessions"])

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()
@router.post("/sessions")
def create_session(
        session_data: CreateSession,
        db: Session = Depends(get_db),
        #current_user: User = Depends(get_current_user), # blocked out for testing frontend
):
    session_row = WorkoutSession(
        user_id = 1,
        date = session_data.date,
        split = session_data.split,
        notes = session_data.notes,
    )
    db.add(session_row)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail = "Session Update Conflict")
    db.refresh(session_row)

    record = {
        "id": session_row.id,
        "date": session_row.date,
        "split": session_row.split,
        "notes": session_row.notes,
    }
    return {k: v for k, v in record.items() if v is not None}

@router.get("/sessions")
def get_sessions(
        db: Session = Depends(get_db),
        #current_user: User = Depends(get_current_user), #commenting out for testing
):
    session_rows = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == 1)
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

@router.get("/sessions/{session_id}/full")
def get_session_full(
        session_id: int,
        db: Session = Depends(get_db),
        #current_user: User = Depends(get_current_user), #commenting out for testing with no auth
):
    #Ownership Check: Session must exist and belong to a current user
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == 1)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail = "Workout Session Not Found")

    #Get exercises in the session
    exercise_rows = (
        db.query(ExerciseEntry)
        .filter(ExerciseEntry.session_id == session_id)
        .order_by(ExerciseEntry.order_index.asc(), ExerciseEntry.id.asc())
        .all()
    )
    exercise_ids = [e.id for e in exercise_rows]

    #Get all sets for those exercises in one query
    set_rows = []
    if exercise_ids:
        set_rows = (
           db.query(SetEntry)
            .filter(SetEntry.exercise_entry_id.in_(exercise_ids))
            .order_by(SetEntry.exercise_entry_id.asc(), SetEntry.set_number.asc(), SetEntry.id.asc())
            .all()
        )

    #Group sets by exercise_entry_id
    sets_by_exercise_id: dict[int, list[dict]] = {}
    for s in set_rows:
        set_record = {
            "id": s.id,
            "set_number": s.set_number,
            "reps": s.reps,
            "weight": s.weight,
            "time_seconds": s.time_seconds,
            "intensity": s.intensity,
        }
        set_record = {k: v for k, v in set_record.items() if v is not None}
        sets_by_exercise_id.setdefault(s.exercise_entry_id, []).append(set_record)

    #Build nested exercises payload
    exercises = []
    for e in exercise_rows:
        exercise_record = {
            "id": e.id,
            "exercise": e.exercise,
            "order_index": e.order_index,
            "sets": sets_by_exercise_id.get(e.id, []),
        }
        if exercise_record["order_index"] is None:
            exercise_record.pop("order_index")
        exercises.append(exercise_record)

    #Final object
    session_record = {
        "id": session_row.id,
        "date": session_row.date,
        "split": session_row.split,
        "notes": session_row.notes,
    }
    session_record = {k: v for k, v in session_record.items() if v is not None}

    return {
        **session_record,
        "exercises": exercises
    }

@router.patch("/sessions/{session_id}")
def update_session(
    session_id: int,
    payload: UpdateSession,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail="Workout Session Not Found")

    data = payload.model_dump(exclude_unset=True)
    data = {k: v for k, v in data.items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No Fields Provided To Update")

    for field, value in data.items():
        setattr(session_row, field, value)

    db.commit()
    db.refresh(session_row)

    record = {
        "id": session_row.id,
        "date": session_row.date,
        "split": session_row.split,
        "notes": session_row.notes,
    }
    return {k: v for k, v in record.items() if v is not None}

@router.delete("/sessions/{session_id}")
def delete_session(
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
        raise HTTPException(status_code=404, detail="Workout Session Not Found")

    # Get exercise entry ids for this session
    exercise_ids = (
        db.query(ExerciseEntry.id)
        .filter(ExerciseEntry.session_id == session_id)
        .all()
    )
    exercise_ids = [row[0] for row in exercise_ids]

    # Delete sets
    if exercise_ids:
        db.query(SetEntry).filter(SetEntry.exercise_entry_id.in_(exercise_ids)).delete(synchronize_session=False)

    # Delete exercises
    db.query(ExerciseEntry).filter(ExerciseEntry.session_id == session_id).delete(synchronize_session=False)

    # Delete session
    db.delete(session_row)
    db.commit()

    return {"deleted": True, "session_id": session_id}