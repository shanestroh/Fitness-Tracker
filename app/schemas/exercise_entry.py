from pydantic import BaseModel, field_validator, model_validator
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

    @field_validator("order_index", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v == 0:
            return None
        return v

class UpdateExerciseEntry(BaseModel):
    exercise: str
    order_index: Optional[int] = None

    @model_validator(mode="after")
    def require_something(self):
        if self.exercise is None and self.order_index is None:
            raise ValueError("Provide at least one field to update.")
        return self

    @field_validator("order_index", mode="before")
    @classmethod
    def zero_to_none(cls, v):
        if v == 0:
            return None
        return v