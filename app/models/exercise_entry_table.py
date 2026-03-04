from sqlalchemy import Column, Integer, String, ForeignKey
from app.db import Base

class ExerciseEntry(Base):
    __tablename__ = "exercise_entries"
    id = Column(Integer,primary_key = True, index = True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), nullable=False)
    exercise = Column(String, nullable=False)
    #orders the exercises
    order_index = Column (Integer, nullable=False)