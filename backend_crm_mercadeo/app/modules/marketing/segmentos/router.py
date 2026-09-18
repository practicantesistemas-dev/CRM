from typing import Literal

from fastapi import APIRouter, Depends, Query

from app.core.dependencies import get_current_username
from app.modules.marketing.segmentos.dependencies import get_segmentos_service
from app.modules.marketing.segmentos.schemas import (
    FiltrosAudiencia,
    ListadoAudienciaSegmento,
)
from app.modules.marketing.segmentos.service import SegmentosService

router = APIRouter(
    prefix="/segmentos",
    tags=["Segmentos"],
    dependencies=[Depends(get_current_username)],
)


@router.get("/audiencias", response_model=ListadoAudienciaSegmento)
def obtener_audiencia(
    plan: Literal["plan_liga", "no_plan_liga"] | None = Query(
        "plan_liga",
        description=(
            "'plan_liga' ejecuta el consolidado TMPBI1 + INTRANET_VISTA_PLANLIGA. "
            "'no_plan_liga' responde vacio (sin fuente todavia)."
        ),
    ),
    sexo: Literal["F", "M", "todos"] | None = Query(
        None, description="None o 'todos' = sin filtro."
    ),
    edad_min: int | None = Query(None, ge=0, le=120),
    edad_max: int | None = Query(None, ge=0, le=120),
    ciudad: str | None = Query(
        None, description="TMPBI1.MUNICIPIO (ej. 'PEREIRA')."
    ),
    departamento: str | None = Query(None),
    concepto: str | None = Query(None),
    servicio: str | None = Query(None),
    tipo_vinculacion: Literal["particular", "empresa", "todos"] | None = Query(
        None,
        description="Segun TIPO_PLAN = PARTICULAR u otro.",
    ),
    ultimo_uso: Literal["90", "60", "30"] | None = Query(
        None,
        description="Sin uso en los ultimos N dias (ULTIMO_USO <= SYSDATE - N).",
    ),
    service: SegmentosService = Depends(get_segmentos_service),
) -> ListadoAudienciaSegmento:
    return service.obtener_audiencia(
        FiltrosAudiencia(
            plan=plan,
            sexo=sexo,
            edad_min=edad_min,
            edad_max=edad_max,
            ciudad=ciudad,
            departamento=departamento,
            concepto=concepto,
            servicio=servicio,
            tipo_vinculacion=tipo_vinculacion,
            ultimo_uso=ultimo_uso,
        )
    )
