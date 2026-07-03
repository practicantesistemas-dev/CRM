from fastapi import FastAPI

from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import setup_middleware
from app.modules.contactos.router import router as contactos_router
from app.shared.pagination import add_pagination

configure_logging()

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

setup_middleware(app)
register_exception_handlers(app)

app.include_router(contactos_router, prefix=settings.API_V1_PREFIX)

add_pagination(app)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}