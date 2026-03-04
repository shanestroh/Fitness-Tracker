from pydantic import BaseModel, field_validator
from typing import Optional

class CreateExerciseEntry(BaseModel):
    exercise: str
    order_index: Optional[int] = None

    @field_validator("exercise", mode="before")
    @classmethod
    def clean_exercise(cls, v):
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("exercise cannot be empty")
        return v