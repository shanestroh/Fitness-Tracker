from fastapi import FastAPI
from app.routers.workouts import router as workouts_router
from app.db import Base, engine
from app.routers.auth import router as auth_router
from app.models.user_table import User
from app.models.workout_table import Workout

Base.metadata.create_all(bind = engine)

app = FastAPI()

app.include_router(workouts_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}