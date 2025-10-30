from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class ItemBase(SQLModel):
    title: str
    category_code: str  # tools|electronics|sports|party|kids
    district: str
    price_per_day: float
    description: Optional[str] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None
    image_url: Optional[str] = None
    status: str = "public"  # public|pending|hidden

class Item(ItemBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ItemCreate(ItemBase):
    pass

class ItemRead(ItemBase):
    id: int
    created_at: datetime
