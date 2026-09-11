from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.marketing.plantillas.repository import PlantillasRepository
from app.modules.marketing.plantillas.service import PlantillasService


def get_plantillas_service(db: Session = Depends(get_db)) -> PlantillasService:
    return PlantillasService(PlantillasRepository(db))
