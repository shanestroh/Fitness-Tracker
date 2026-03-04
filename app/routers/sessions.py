from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import session_local
from app.dependencies import get_current_user
from app.models.user_table import User
from app.models.workout_session_table import WorkoutSession
from app.schemas.session import CreateSession
from app.models.exercise_entry_table import ExerciseEntry
from app.models.set_entry_table import SetEntry
from app.schemas.session_full import CreateSessionFull

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

@router.get("/sessions")
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

@router.get("/sessions/{session_id}/full")
def get_session_full(
        session_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    #Ownership Check: Session must exist and belong to a current user
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
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
        "session": session_record,
        "exercises": exercises
    }

@router.post("/sessions/{session_id}/full")
def create_session_full(
        session_id: int,
        payload: CreateSessionFull,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
):
    #Ownership Check
    session_row = (
        db.query(WorkoutSession)
        .filter(WorkoutSession.id == session_id, WorkoutSession.user_id == current_user.id)
        .first()
    )
    if session_row is None:
        raise HTTPException(status_code=404, detail="Workout Session Not Found")

    #Determine next available order_index
    max_order_index = (
        db.query(ExerciseEntry.order_index)
        .filter(ExerciseEntry.session_id == session_id, ExerciseEntry.order_index.isnot(None))
        .order_by(ExerciseEntry.order_index.desc())
        .first()
    )
    next_order_index = 1 if (max_order_index is None or max_order_index[0] is None) else max_order_index[0] + 1

    created_exercises = []

    #Either everything is created or nothing is
    try:
        with db.begin():
            for exercise_input in payload.exercises:
                exercise_order_index = exercise_input.order_index
                if exercise_order_index is None:
                    exercsie_order_index = next_order_index
                    next_order_index += 1

                exercise_row = ExerciseEntry(
                    session_id=session_id,
                    exercise=exercise_input.exercise,
                    order_index=exercise_order_index,
                )
                db.add(exercise_row)
                db.flush()  #Ensures exercise_row.id exists

                next_set_number = 1
                created_sets = []

                for set_input in exercise_input.sets:
                    set_number = set_input.set_number
                    if set_number is None:
                        set_number = next_set_number
                        next_set_number += 1

                    set_row = SetEntry(
                        exercise_entry_id = exercise_row.id,
                        set_number = set_number,
                        reps = set_input.reps,
                        weight = set_input.weight,
                        time_seconds = set_input.time_seconds,
                        intensity = set_input.intensity,
                    )
                    db.add(set_row)
                    db.flush()

                    created_sets.append(
                        {k: v for k, v in {
                            "id": set_row.id,
                            "set_number": set_row.set_number,
                            "reps": set_row.reps,
                            "weight": set_row.weight,
                            "time_seconds": set_row.time_seconds,
                            "intensity": set_row.intensity,
                        }.items() if v is not None}
                    )

                created_exercises.append({
                    "id": exercise_row.id,
                    "exercise": exercise_row.exercise,
                    "order_index": exercise_row.order_index,
                    "sets": created_sets,
                })

    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to Create Full Session Payload")
    return{
        "session_id": session_id,
        "exercises": created_exercises,
    }