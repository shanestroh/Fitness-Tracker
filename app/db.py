from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

database_url = "sqlite:///./fitness.db"

engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False}
)

session_local = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()
