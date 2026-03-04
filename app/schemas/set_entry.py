from pydantic import BaseModel, field_validator, model_validator
from typing import Optional

class CreateSetEntry(BaseModel):
    reps: Optional[int] = None
    weight: Optional[float] = None
    time_seconds: Optional[int] = None
    intensity: Optional[str] = None

    #Swagger's default 0 is treated as "Not provided"
    @field_validator("weight", "time_seconds", mode="before")
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

    @model_validator(mode="after")
    def require_reps_or_time(self):
        if self.reps is None and self.time_seconds is None:
            raise ValueError("Provide either reps (lifting) or time_seconds (cardio).")
        return self

class UpdateSetEntry(BaseModel):
    reps: Optional[int] = None
    weight: Optional[float] = None
    time_seconds: Optional[int] = None
    intensity: Optional[str] = None