import os
from pydantic import BaseModel
from typing import List

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./rently.db")
    cors_origins: List[str] = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]

settings = Settings()
