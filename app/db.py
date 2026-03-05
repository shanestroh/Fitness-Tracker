from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
import sqlite3
from sqlalchemy.orm import sessionmaker, declarative_base

database_url = "sqlite:///./fitness.db"

engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False}
)

session_local = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()
