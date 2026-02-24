from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import session_local
from app.schemas.workout import CreateWorkout
from app.models.workout_table import Workout

router = APIRouter()

def get_db():
    db = session_local()
    try:
        yield db
    finally:
        db.close()


@router.post("/workouts")
def create_workout(workout : CreateWorkout, db: Session = Depends(get_db)):
    if not workout.exercise.strip():
        raise HTTPException(status_code=400, detail="exercise cannot be empty")

    workout_row = Workout(
        exercise = workout.exercise.strip(),
        sets = workout.sets,
        reps = workout.reps,
        weight = workout.weight,
        date = workout.date,
        notes = workout.notes,
    )

    db.add(workout_row)
    db.commit()
    db.refresh(workout_row)

    response = {
        "id" : workout_row.id,
        "exercise" : workout_row.exercise,
        "sets" : workout_row.sets,
        "reps" : workout_row.reps,
        "weight" : workout_row.weight,
        "date" : workout_row.date,
        "notes" : workout_row.notes,
    }
    return {k: v for k, v in response.items() if v is not None}

@router.get("/workouts")
def get_workouts(db: Session = Depends(get_db)):
    workout_rows = db.query(Workout).order_by(Workout.date.desc(), Workout.id.desc()).all()

    results = []

    for row in workout_rows:
        record = {
            "id" : row.id,
            "exercise" : row.exercise,
            "sets" : row.sets,
            "reps" : row.reps,
            "weight" : row.weight,
            "date" : row.date,
            "notes" : row.notes,
        }
        results.append({k:v for k, v in record.items() if v is not None})
    return results