from fastapi import FastAPI
from app.routers.workouts import router as workouts_router
from app.db import Base, engine

Base.metadata.create_all(bind = engine)

app = FastAPI()

app.include_router(workouts_router)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}