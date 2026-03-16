from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import text

# Load .env manually
load_dotenv(Path(__file__).resolve().parent / ".env")

from backend.db import engine

with engine.connect() as conn:
    conn.execute(text("""
        ALTER TABLE exercise_entries
        ADD COLUMN IF NOT EXISTS exercise_type VARCHAR NOT NULL DEFAULT 'lift';
    """))
    conn.commit()

print("Migration complete.")