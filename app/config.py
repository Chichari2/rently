import os
from typing import List
from pydantic import BaseModel


def normalize_db_url(url: str) -> str:
    # Render часто отдаёт postgres:// — SQLAlchemy ждёт postgresql+psycopg://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://") and "+psycopg" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


class Settings(BaseModel):
    database_url: str = normalize_db_url(
        os.getenv("DATABASE_URL", "sqlite:///./rently.db")
    )
    cors_origins: List[str] = [
        o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()
    ]


settings = Settings()
