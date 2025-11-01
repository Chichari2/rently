from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from .config import settings
from .db import init_db
from .routers import items

app = FastAPI(title="Rently API")

# --- CORS (можно оставить для совместимости с внешними доменами) ---
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- API роуты ---
app.include_router(items.router)

@app.on_event("startup")
def on_startup():
    init_db()

# --- Раздача фронтенда ---
# Корень проекта = .../rently ; frontend_dir = .../rently/frontend
PROJECT_ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = PROJECT_ROOT / "frontend"

# /assets -> frontend/assets (css/js/img)
app.mount(
    "/assets",
    StaticFiles(directory=str(FRONTEND_DIR / "assets")),
    name="assets"
)

# Страницы
@app.get("/", include_in_schema=False)
def page_index():
    return FileResponse(str(FRONTEND_DIR / "index.html"))

@app.get("/index.html", include_in_schema=False)
def page_index_html():
    return FileResponse(str(FRONTEND_DIR / "index.html"))

@app.get("/catalog.html", include_in_schema=False)
def page_catalog():
    return FileResponse(str(FRONTEND_DIR / "catalog.html"))

@app.get("/add.html", include_in_schema=False)
def page_add():
    return FileResponse(str(FRONTEND_DIR / "add.html"))

@app.get("/item.html", include_in_schema=False)
def page_item():
    return FileResponse(str(FRONTEND_DIR / "item.html"))

# Простой health-check (оставим как было)
@app.get("/health", include_in_schema=False)
def health():
    return {"ok": True}
