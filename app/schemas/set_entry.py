from pydantic import BaseModel, field_validator
from typing import Optional

class CreateSetEntry(BaseModel):
    set_number: Optional[int] = None
    reps: Optional[int] = None
    weight: Optional[float] = None
    time_seconds: Optional[int] = None
    intensity: Optional[str] = None

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