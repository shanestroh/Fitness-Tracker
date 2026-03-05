from fastapi import FastAPI
from backend.db import Base, engine

from backend.routers.auth import router as auth_router
from backend.routers.sessions import router as sessions_router
from backend.routers.exercise_entries import router as exercise_entries_router
from backend.routers.set_entries import router as set_entries_router

from backend.models.user_table import User

from backend.models.workout_session_table import WorkoutSession
from backend.models.exercise_entry_table import ExerciseEntry
from backend.models.set_entry_table import SetEntry


Base.metadata.create_all(bind = engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(exercise_entries_router)
app.include_router(set_entries_router)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}