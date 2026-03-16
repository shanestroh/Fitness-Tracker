from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, CheckConstraint, Index, Enum
from backend.db import Base
import enum

class ExerciseType(str, enum.Enum):
    lift = "lift"
    cardio = "cardio"

class ExerciseEntry(Base):
    __tablename__ = "exercise_entries"
    id = Column(Integer,primary_key = True, index = True)
    session_id = Column(
        Integer,
        ForeignKey("workout_sessions.id", ondelete="CASCADE"),
        nullable = False,
        index = True
    )
    exercise = Column(String, nullable=False)
    exercise_type = Column(Enum(ExerciseType), nullable=False, default=ExerciseType.lift)
    #orders the exercises
    order_index = Column(Integer, nullable=True)

    __table_args__ = (
        # No two exercises in the same session can share an order_index
        UniqueConstraint("session_id", "order_index", name="uq_exercise_session_order"),
        CheckConstraint("order_index >= 1", name="ck_exercise_order_index_ge_1"),
        Index("ix_exercise_session_order", "session_id", "order_index"),
    )