from fastapi import FastAPI
from app.routers.workouts import router as workouts_router

app = FastAPI()

app.include_router(workouts_router)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}