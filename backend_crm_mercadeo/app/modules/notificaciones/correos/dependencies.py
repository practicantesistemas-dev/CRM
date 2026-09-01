from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.notificaciones.correos.service import CorreosService


def get_correos_service(db: Session = Depends(get_db)) -> CorreosService:
    return CorreosService(db)
