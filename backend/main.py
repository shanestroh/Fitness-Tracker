from fastapi import FastAPI, Depends
from backend.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from backend.dependencies import verify_api_key
from dotenv import load_dotenv

load_dotenv()

from backend.routers.sessions import router as sessions_router
from backend.routers.exercise_entries import router as exercise_entries_router
from backend.routers.set_entries import router as set_entries_router


Base.metadata.create_all(bind = engine)

app = FastAPI(dependencies=[Depends(verify_api_key)])

app.include_router(sessions_router)
app.include_router(exercise_entries_router)
app.include_router(set_entries_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def home():
    return {"message" : "Fitness Tracker is running"}