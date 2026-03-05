from sqlalchemy import Column, Integer, Float, String, ForeignKey, UniqueConstraint, CheckConstraint, Index
from app.db import Base

class SetEntry(Base):
    __tablename__ = "set_entries"
    id = Column(Integer, primary_key=True, index=True)
    exercise_entry_id = Column(
        Integer,
        ForeignKey("exercise_entries.id", ondelete = "CASCADE"),
        nullable = False,
        index = True,
    )
    #Strength fields
    set_number = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    #Cardio
    time_seconds = Column(Integer, nullable=True)
    intensity = Column(String, nullable=True)

    __table_args__ = (
        #No two sets for the same exercise can share a set_number
        UniqueConstraint("exercise_entry_id", "set_number", name = "uq_set_exercise_setnumber"),

        CheckConstraint("set_number >= 1", name="ck_set_number_ge_1"),
        CheckConstraint("reps IS NULL OR reps >= 0", name="ck_reps_ge_0"),
        CheckConstraint("weight IS NULL OR weight >= 0", name="ck_weight_ge_0"),
        CheckConstraint("time_seconds IS NULL OR time_seconds >= 0", name="ck_time_seconds_ge_0"),

        #Set must be either lifting or cardio
        CheckConstraint("(reps IS NOT NULL) OR (time_seconds IS NOT NULL)", name="ck_set_reps_or_time"),

        Index("ix_set_exercise_setnum", "exercise_entry_id", "set_number"),
    )
