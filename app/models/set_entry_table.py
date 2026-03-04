from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.db import Base

class SetEntry(Base):
    __tablename__ = "set_entries"
    id = Column(Integer, primary_key=True, index=True)
    exercise_entry_id = Column(Integer, ForeignKey("exercise_entries.id"), nullable=False)
    #Strength fields
    set_number = Column(Integer, nullable=True)
    reps = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    #Cardio
    time_seconds = Column(Integer, nullable=True)
    intensity = Column(String, nullable=True)