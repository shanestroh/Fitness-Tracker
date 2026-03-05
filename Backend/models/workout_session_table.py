from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from Backend.db import Base

class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    split = Column(String, nullable=False)
    notes = Column(Text, nullable=True)