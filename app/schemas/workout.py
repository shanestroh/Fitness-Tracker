from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import date


class CreateWorkout(BaseModel):
    exercise: str
    sets: Optional[int] = None
    reps: Optional[float] = None
    weight: Optional[float] = None
    date: date
    notes : Optional[str] = None

    #Converts SwaggerUI default numeric values "0" to None
    @field_validator("sets", "reps", "weight", mode = "before")
    @classmethod
    def zero_to_none(cls, v):
        if v == 0 or v == 0.0:
            return None
        return v

    #Convert "" or Swagger's default "string" to None
    @field_validator("notes", mode = "before")
    @classmethod
    def clean_notes(cls,v):
        if v is None:
            return None

        if isinstance(v, str):
            v = v.strip()
            if v == "" or v.lower() == "string":
                return None
        return v