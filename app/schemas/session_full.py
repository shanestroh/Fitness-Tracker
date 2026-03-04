from pydantic import BaseModel, field_validator
from typing import Optional, List

class CreateFullSetEntry(BaseModel):
    set_number: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    time_seconds: Optional[int] = None
    intensity: Optional[str] = None

    #Treat Swagger default "0/0.0" as not provided
    @field_validator("set_number", "reps", "weight", "time_seconds", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v == 0 or v == 0.0:
            return None
        return v

    @field_validator("intensity", mode="before")
    @classmethod
    def clean_intensity(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            if v == "" or v.lower() == "string":
                return None
        return v

class CreateFullExerciseEntry(BaseModel):
    exercise: str
    order_index: Optional[int] = None
    sets: List[CreateFullSetEntry] = []

    @field_validator("exercise", mode="before")
    @classmethod
    def clean_exercise(cls, v):
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("exercise cannot be empty")
        return v

    @field_validator("order_index", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v == 0:
            return None
        return v

class CreateSessionFull(BaseModel):
    exercises: List[CreateFullExerciseEntry]