FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# код приложения (backend + frontend + alembic файлы)
COPY app ./app
COPY frontend ./frontend
COPY alembic.ini .
COPY alembic ./alembic

# На Render переменная $PORT задана автоматически
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
