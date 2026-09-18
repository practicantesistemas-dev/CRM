from pydantic import BaseModel, Field


class FiltrosAudiencia(BaseModel):
    """Filtros del consolidado TMPBI1 + INTRANET_VISTA_PLANLIGA
    (GET /segmentos/audiencias)."""

    plan: str | None = Field(
        default="plan_liga",
        description="'plan_liga' ejecuta el consolidado. 'no_plan_liga' responde vacio.",
    )
    sexo: str | None = Field(default=None, description="'F' | 'M' | 'todos'/None.")
    edad_min: int | None = None
    edad_max: int | None = None
    ciudad: str | None = Field(
        default=None,
        description="Valor de TMPBI1.MUNICIPIO (nombre, ej. 'PEREIRA').",
    )
    departamento: str | None = None
    concepto: str | None = None
    servicio: str | None = None
    tipo_vinculacion: str | None = Field(
        default=None,
        description="'particular' | 'empresa' | 'todos'/None (segun TIPO_PLAN).",
    )
    ultimo_uso: str | None = Field(
        default=None,
        description="'90' | '60' | '30' = sin uso en esos dias. None = sin filtro.",
    )


class AudienciaSegmentoItem(BaseModel):
    """Una persona del consolidado (ultima fila de servicio por identificacion)."""

    IDENTIFICACION: str | None = None
    NOMBRES: str | None = None
    EMPRESA: str | None = None
    SEXO: str | None = None
    EDAD: int | None = None
    CIUDAD: str | None = None
    DEPARTAMENTO: str | None = None
    CORREO: str | None = None
    TELEFONO: str | None = None
    TIPO_PLAN: str | None = None
    CONCEPTO: str | None = None
    SERVICIO: str | None = None
    ESPECIALIDAD: str | None = None
    SERVICIOS_USADOS: int | None = None
    ULTIMO_USO: str | None = None
    TIPO_VINCULACION: str | None = None


class ListadoAudienciaSegmento(BaseModel):
    total: int
    items: list[AudienciaSegmentoItem]


# Alias por compatibilidad con imports previos del modulo.
TitularSegmentoItem = AudienciaSegmentoItem
ListadoTitularesSegmento = ListadoAudienciaSegmento
