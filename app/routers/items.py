from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from ..db import get_session
from ..models import Item, ItemCreate, ItemRead

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=List[ItemRead])
def list_items(
    q: Optional[str] = Query(None),
    category_code: Optional[str] = None,
    district: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    session: Session = Depends(get_session),
):
    stmt = select(Item).where(Item.status != "hidden")
    if q:
        like = f"%{q}%"
        stmt = stmt.where(Item.title.ilike(like))
    if category_code:
        stmt = stmt.where(Item.category_code == category_code)
    if district:
        stmt = stmt.where(Item.district == district)
    if min_price is not None:
        stmt = stmt.where(Item.price_per_day >= min_price)
    if max_price is not None:
        stmt = stmt.where(Item.price_per_day <= max_price)
    return session.exec(stmt.order_by(Item.id.desc())).all()


@router.get("/{item_id}", response_model=ItemRead)
def get_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item or item.status == "hidden":
        raise HTTPException(404, "Item not found")
    return item


@router.post("/", response_model=ItemRead, status_code=201)
def create_item(data: ItemCreate, session: Session = Depends(get_session)):
    # pydantic v2-friendly
    item = Item(**data.model_dump())
    session.add(item)
    session.commit()
    session.refresh(item)
    return item
