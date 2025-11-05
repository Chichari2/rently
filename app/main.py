from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .db import init_db
from .routers import items

app = FastAPI(title="Rently API")

# CORS
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# API
app.include_router(items.router)

@app.on_event("startup")
def on_startup():
    init_db()

# Frontend
PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"

# /assets -> frontend/assets
app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

@app.get("/health", include_in_schema=False)
def health():
    return {"ok": True}

@app.get("/", include_in_schema=False)
def root():
    return FileResponse(str(FRONTEND_DIR / "index.html"))

# универсальная раздача *.html
@app.get("/{page}.html", include_in_schema=False)
def any_html(page: str):
    p = (FRONTEND_DIR / f"{page}.html").resolve()
    if not p.exists() or FRONTEND_DIR not in p.parents:
        raise HTTPException(status_code=404)
    return FileResponse(str(p))
