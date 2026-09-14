from app.modules.marketing.segmentos.repository import SegmentosRepository
from app.modules.marketing.segmentos.schemas import (
    ListadoTitularesSegmento,
    TitularSegmentoItem,
)


class SegmentosService:
    def __init__(self, repository: SegmentosRepository) -> None:
        self.repository = repository

    def buscar_titulares(
        self,
        plan: str | None,
        estado: str | None,
        sexo: str | None,
        edad_min: int | None,
        edad_max: int | None,
        ciudades: list[str] | None,
        vinculacion: str | None,
        offset: int,
        limit: int,
    ) -> ListadoTitularesSegmento:
        # INTRANET_PLANLIGA son SOLO afiliados a Plan Liga: "No plan Liga" no
        # tiene fuente real todavia (viviria en Comercial/mercadeo_crm_contactos,
        # con otro esquema - sexo en texto, "municipio" en vez de CIUDAD/codigo,
        # sin columna EMPRESA para vinculacion). Por ahora se responde vacio en
        # vez de adivinar esa union.
        if plan == "no_plan_liga":
            return ListadoTitularesSegmento(total=0, items=[])

        filtros = {
            "estado": estado,
            "sexo": sexo,
            "edad_min": edad_min,
            "edad_max": edad_max,
            "ciudades": ciudades,
            "vinculacion": vinculacion,
        }
        total = self.repository.contar_titulares(**filtros)
        filas = self.repository.listar_titulares(offset=offset, limit=limit, **filtros)
        return ListadoTitularesSegmento(
            total=total,
            items=[TitularSegmentoItem(**fila) for fila in filas],
        )
