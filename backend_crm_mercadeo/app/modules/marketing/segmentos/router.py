from typing import Literal

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_username
from app.modules.marketing.segmentos.dependencies import get_segmentos_service
from app.modules.marketing.segmentos.schemas import ListadoTitularesSegmento
from app.modules.marketing.segmentos.service import SegmentosService

router = APIRouter(
    prefix="/segmentos", tags=["Segmentos"], dependencies=[Depends(get_current_username)]
)


@router.get("/titulares", response_model=ListadoTitularesSegmento)
def buscar_titulares(
    plan: Literal["plan_liga", "no_plan_liga"] | None = Query(
        None,
        description=(
            "'plan_liga' consulta INTRANET_PLANLIGA (unica fuente disponible). "
            "'no_plan_liga' todavia no tiene fuente de datos: responde vacio."
        ),
    ),
    sexo: Literal["F", "M"] | None = Query(None, description="Vacio = todos"),
    edad_min: int | None = Query(None, ge=0, le=120),
    edad_max: int | None = Query(None, ge=0, le=120),
    ciudades: list[str] | None = Query(
        None,
        description=(
            "Codigos DIVIPOLA completos (MUNCOD, ej. '66001' = Pereira) "
            "tal como los devuelve GET /compartidos/ubicaciones/municipios."
        ),
    ),
    vinculacion: Literal["empresa", "particular"] | None = Query(None),
    estado: Literal["activo", "inactivo", "todos"] = Query(
        "activo", description="Estado del titular en Plan Liga"
    ),
    # Concepto / Servicio / Ultimo uso: no hay tabla de citas/servicios
    # prestados en esta base (vive en el sistema clinico, no mapeado aqui).
    # Se reciben para no romper al frontend, pero por ahora no filtran nada.
    concepto: list[str] | None = Query(None, include_in_schema=False),
    servicios: list[str] | None = Query(None, include_in_schema=False),
    ultimo_uso: str | None = Query(None, include_in_schema=False),
    offset: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=500),
    service: SegmentosService = Depends(get_segmentos_service),
) -> ListadoTitularesSegmento:
    return service.buscar_titulares(
        plan=plan,
        estado=estado,
        sexo=sexo,
        edad_min=edad_min,
        edad_max=edad_max,
        ciudades=ciudades,
        vinculacion=vinculacion,
        offset=offset,
        limit=limit,
    )
