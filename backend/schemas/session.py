from pydantic import BaseModel, field_validator, model_validator
from typing import Optional
from datetime import date

class CreateSession(BaseModel):
    date: date
    split: str
    notes: Optional[str] = None

    @field_validator("split", mode = "before")
    @classmethod
    def clean_split(cls, v):
        if isinstance(v, str):
            v = v.strip()
        if not v:
            raise ValueError("split cannot be empty")
        return v
    @field_validator("notes", mode="before")
    @classmethod
    def clean_notes(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            if v == "" or v.lower() == "string":
                return None
        return v

class UpdateSession(BaseModel):
    date: Optional[date] = None
    split: Optional[str] = None
    notes: Optional[str] = None

    @field_validator("split", "notes", mode="before")
    @classmethod
    def clean_strings(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            if v == "" or v.lower() == "string":
                return None
        return v

    @model_validator(mode="after")
    def require_something(self):
        if self.date is None and self.split is None and self.notes is None:
            raise ValueError("Provide at least one field to update.")
        return self