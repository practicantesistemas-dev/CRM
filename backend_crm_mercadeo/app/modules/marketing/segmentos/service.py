from fastapi import HTTPException

from .repository import SegmentosRepository
from .schemas import FiltrosAudiencia, ListadoAudienciaSegmento

VALORES_PLAN = {"plan_liga", "no_plan_liga"}
VALORES_TIPO_VINCULACION = {"particular", "empresa", "todos"}
VALORES_SEXO = {"f", "m", "todos"}
VALORES_ULTIMO_USO = {"90", "60", "30"}


class SegmentosService:
    def __init__(self, repository: SegmentosRepository) -> None:
        self.repository = repository

    def _texto_o_none(self, valor: str | None) -> str | None:
        if valor is None:
            return None
        limpio = valor.strip()
        return limpio or None

    def _normalizar_filtros(self, filtros: FiltrosAudiencia) -> FiltrosAudiencia:
        plan = (filtros.plan or "plan_liga").strip().lower()
        if plan not in VALORES_PLAN:
            raise HTTPException(status_code=400, detail=f"plan invalido: {filtros.plan!r}")

        sexo = filtros.sexo
        if sexo and sexo.strip().lower() == "todos":
            sexo = None
        elif sexo and sexo.strip().lower() not in VALORES_SEXO:
            raise HTTPException(status_code=400, detail=f"sexo invalido: {sexo!r}")
        elif sexo:
            sexo = sexo.strip().upper()

        tipo_vinculacion = filtros.tipo_vinculacion
        if tipo_vinculacion and tipo_vinculacion.strip().lower() == "todos":
            tipo_vinculacion = None
        elif (
            tipo_vinculacion
            and tipo_vinculacion.strip().lower() not in VALORES_TIPO_VINCULACION
        ):
            raise HTTPException(
                status_code=400,
                detail=f"tipo_vinculacion invalido: {tipo_vinculacion!r}",
            )
        elif tipo_vinculacion:
            tipo_vinculacion = tipo_vinculacion.strip().lower()

        ultimo_uso = self._texto_o_none(filtros.ultimo_uso)
        if ultimo_uso and ultimo_uso not in VALORES_ULTIMO_USO:
            raise HTTPException(
                status_code=400,
                detail=f"ultimo_uso invalido: {filtros.ultimo_uso!r} (use 90, 60 o 30)",
            )

        if (
            filtros.edad_min is not None
            and filtros.edad_max is not None
            and filtros.edad_min > filtros.edad_max
        ):
            raise HTTPException(
                status_code=400,
                detail="edad_min no puede ser mayor que edad_max",
            )

        return FiltrosAudiencia(
            plan=plan,
            sexo=sexo,
            edad_min=filtros.edad_min,
            edad_max=filtros.edad_max,
            ciudad=self._texto_o_none(filtros.ciudad),
            departamento=self._texto_o_none(filtros.departamento),
            concepto=self._texto_o_none(filtros.concepto),
            servicio=self._texto_o_none(filtros.servicio),
            tipo_vinculacion=tipo_vinculacion,
            ultimo_uso=ultimo_uso,
        )

    def obtener_audiencia(self, filtros: FiltrosAudiencia) -> ListadoAudienciaSegmento:
        filtros_normalizados = self._normalizar_filtros(filtros)

        listar = (
            self.repository.listar_audiencia_no_plan_liga
            if filtros_normalizados.plan == "no_plan_liga"
            else self.repository.listar_audiencia
        )
        items = listar(
            sexo=filtros_normalizados.sexo,
            edad_min=filtros_normalizados.edad_min,
            edad_max=filtros_normalizados.edad_max,
            ciudad=filtros_normalizados.ciudad,
            departamento=filtros_normalizados.departamento,
            concepto=filtros_normalizados.concepto,
            servicio=filtros_normalizados.servicio,
            tipo_vinculacion=filtros_normalizados.tipo_vinculacion,
            ultimo_uso=filtros_normalizados.ultimo_uso,
        )
        return ListadoAudienciaSegmento(total=len(items), items=items)
