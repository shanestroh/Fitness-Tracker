from fastapi import FastAPI
from app.db import Base, engine

from app.routers.workouts import router as workouts_router
from app.routers.auth import router as auth_router
from app.routers.sessions import router as sessions_router
from app.routers.exercise_entries import router as exercise_entries_router

from app.models.user_table import User
from app.models.workout_table import Workout

from app.models.workout_session_table import WorkoutSession
from app.models.exercise_entry_table import ExerciseEntry
from app.models.set_entry_table import SetEntry


Base.metadata.create_all(bind = engine)

app = FastAPI()

app.include_router(workouts_router)
app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(exercise_entries_router)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}