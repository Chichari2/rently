import os
import sys
from logging.config import fileConfig
from alembic import context
from sqlmodel import SQLModel

# Добавляем корень проекта в PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Импортируем настройки и engine FastAPI
from app.config import settings
from app.db import engine as app_engine
from app.models import Item  # noqa — важно, чтобы модели были импортированы

# Alembic Config
config = context.config

# Логирование
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Метаданные для автогенерации миграций
target_metadata = SQLModel.metadata


def run_migrations_offline():
    """Запуск миграций в offline-режиме (без подключения к базе)."""
    url = settings.database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Онлайн-режим (как в проде, через engine)."""
    connectable = app_engine  # берём engine из приложения

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
