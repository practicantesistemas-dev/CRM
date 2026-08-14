from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.servicios_proveedores.servicios.service import ServicioService


def get_servicio_service(db: Session = Depends(get_db)) -> ServicioService:
    return ServicioService(db)
