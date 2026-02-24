from fastapi import APIRouter
from app.schemas.workout import CreateWorkout

router = APIRouter()

workout_storage = []

@router.post("/workouts")
def create_workout(workout : CreateWorkout):
    workout_dict = workout.model_dump(exclude_none=True)

    workout_dict["id"] = len(workout_storage) + 1
    workout_storage.append(workout_dict)

    return workout_dict

@router.get("/workouts")
def get_workouts():
    return workout_storage
