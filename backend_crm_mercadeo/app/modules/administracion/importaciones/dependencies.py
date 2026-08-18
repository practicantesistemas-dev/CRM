from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.administracion.importaciones.service import ImportacionService


def get_importacion_service(db: Session = Depends(get_db)) -> ImportacionService:
    return ImportacionService(db)
