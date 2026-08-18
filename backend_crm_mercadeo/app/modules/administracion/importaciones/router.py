from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_username
from app.modules.administracion.importaciones.dependencies import get_importacion_service
from app.modules.administracion.importaciones.schemas import ImportacionCreate, ImportacionRead
from app.modules.administracion.importaciones.service import ImportacionService

router = APIRouter(
    prefix="/importaciones", tags=["Importaciones"], dependencies=[Depends(get_current_username)]
)


@router.get("/", response_model=list[ImportacionRead])
def list_importaciones(
    limit: int = Query(50, ge=1, le=200),
    service: ImportacionService = Depends(get_importacion_service),
) -> list[ImportacionRead]:
    return service.listar(limit)


@router.post("/", response_model=ImportacionRead, status_code=status.HTTP_201_CREATED)
def create_importacion(
    data: ImportacionCreate,
    username: str = Depends(get_current_username),
    service: ImportacionService = Depends(get_importacion_service),
) -> ImportacionRead:
    return service.crear(data, username)
