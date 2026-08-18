from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_username
from app.modules.servicios_proveedores.servicios.dependencies import get_servicio_service
from app.modules.servicios_proveedores.servicios.schemas import (
    ServicioCreate,
    ServicioListado,
    ServicioRead,
)
from app.modules.servicios_proveedores.servicios.service import ServicioService

# intranet_planliga_tipo_plan es una tabla externa (del portal): se permite crear planes
# desde este CRM (a pedido), pero no editarlos ni borrarlos.
router = APIRouter(
    prefix="/servicios", tags=["Servicios"], dependencies=[Depends(get_current_username)]
)


@router.get("/", response_model=ServicioListado)
def list_servicios(
    q: str | None = Query(None, description="Busca por nombre"),
    categoria: str | None = None,
    tipo_cliente: str | None = None,
    estado: str | None = None,
    skip: int = 0,
    limit: int = Query(100, ge=1, le=200),
    service: ServicioService = Depends(get_servicio_service),
) -> ServicioListado:
    return service.list(
        q=q, categoria=categoria, tipo_cliente=tipo_cliente, estado=estado, skip=skip, limit=limit
    )


@router.get("/categorias", response_model=list[str])
def list_categorias_servicios(
    service: ServicioService = Depends(get_servicio_service),
) -> list[str]:
    return service.categorias()


@router.post("/", response_model=ServicioRead, status_code=status.HTTP_201_CREATED)
def create_servicio(
    data: ServicioCreate, service: ServicioService = Depends(get_servicio_service)
) -> ServicioRead:
    return service.crear(data)
