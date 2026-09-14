from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.marketing.segmentos.repository import SegmentosRepository
from app.modules.marketing.segmentos.service import SegmentosService


def get_segmentos_service(db: Session = Depends(get_db)) -> SegmentosService:
    return SegmentosService(SegmentosRepository(db))
