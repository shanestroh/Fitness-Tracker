from pydantic import BaseModel
from typing import Optional
from datetime import date


class CreateWorkout(BaseModel):
    exercise: str
    sets: int
    reps: float
    weight: Optional[float] = None
    date: date