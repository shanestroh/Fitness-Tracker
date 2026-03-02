from sqlalchemy import Column, Integer, String, Float, Date, Text, ForeignKey
from app.db import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    exercise = Column(String, nullable = False)
    sets = Column(Integer, nullable = True)
    reps = Column(Float, nullable = True)
    weight = Column(Float, nullable = True)
    date = Column(Date, nullable = False)
    notes = Column(Text, nullable = True)