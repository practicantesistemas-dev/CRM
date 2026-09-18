from datetime import date, datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from .schemas import AudienciaSegmentoItem

# Consolidado de marketing: servicios clinicos (TMPBI1) cruzados con
# afiliados activos de Plan Liga (INTRANET_VISTA_PLANLIGA). Una fila por
# persona (RN=1 = ultimo servicio).
_SQL_AUDIENCIA = """
SELECT *
FROM (
    SELECT
        t.IDENTIFICACION,
        t.NOMBRES,
        t.EMPRESA,
        t.SEXO,
        t.EDAD,
        t.MUNICIPIO AS CIUDAD,
        t.DEPARTAMENTO,
        t.PACCOE AS CORREO,
        t.PACCEL AS TELEFONO,
        t.TIPO_PLAN,
        t.CONCEPTO,
        t.SERVICIO,
        t.ESPECIALIDAD,
        COUNT(*) OVER (PARTITION BY t.IDENTIFICACION) AS SERVICIOS_USADOS,
        MAX(t.FECHA) OVER (PARTITION BY t.IDENTIFICACION) AS ULTIMO_USO,
        CASE
            WHEN UPPER(t.TIPO_PLAN) = 'PARTICULAR' THEN 'Particular'
            ELSE 'Empresa'
        END AS TIPO_VINCULACION,
        ROW_NUMBER() OVER (
            PARTITION BY t.IDENTIFICACION
            ORDER BY t.FECHA DESC
        ) AS RN
    FROM TMPBI1 t
    INNER JOIN (
        SELECT DISTINCT DOCUMENTO, ESTADO
        FROM INTRANET_VISTA_PLANLIGA
    ) p
        ON p.DOCUMENTO = t.IDENTIFICACION
    WHERE p.ESTADO = 'A'
      AND (:sexo IS NULL OR UPPER(t.SEXO) = UPPER(:sexo))
      AND (:edad_min IS NULL OR t.EDAD >= :edad_min)
      AND (:edad_max IS NULL OR t.EDAD <= :edad_max)
      AND (:ciudad IS NULL OR UPPER(t.MUNICIPIO) = UPPER(:ciudad))
      AND (:departamento IS NULL OR UPPER(t.DEPARTAMENTO) = UPPER(:departamento))
      AND (:concepto IS NULL OR UPPER(t.CONCEPTO) = UPPER(:concepto))
      AND (:servicio IS NULL OR UPPER(t.SERVICIO) = UPPER(:servicio))
      AND (
            :tipo_vinculacion IS NULL
            OR (UPPER(:tipo_vinculacion) = 'PARTICULAR' AND UPPER(t.TIPO_PLAN) = 'PARTICULAR')
            OR (
                UPPER(:tipo_vinculacion) = 'EMPRESA'
                AND (t.TIPO_PLAN IS NULL OR UPPER(t.TIPO_PLAN) != 'PARTICULAR')
            )
      )
)
WHERE RN = 1
  AND (
        :ultimo_uso IS NULL
        OR (:ultimo_uso = '90' AND ULTIMO_USO <= SYSDATE - 90)
        OR (:ultimo_uso = '60' AND ULTIMO_USO <= SYSDATE - 60)
        OR (:ultimo_uso = '30' AND ULTIMO_USO <= SYSDATE - 30)
  )
ORDER BY ULTIMO_USO DESC NULLS LAST
"""


def _fecha_iso(valor) -> str | None:
    if valor is None:
        return None
    if isinstance(valor, datetime):
        return valor.date().isoformat()
    if isinstance(valor, date):
        return valor.isoformat()
    return str(valor)


class SegmentosRepository:
    """Consulta el consolidado TMPBI1 para el segmentador de campanas."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def listar_audiencia(
        self,
        sexo: str | None = None,
        edad_min: int | None = None,
        edad_max: int | None = None,
        ciudad: str | None = None,
        departamento: str | None = None,
        concepto: str | None = None,
        servicio: str | None = None,
        tipo_vinculacion: str | None = None,
        ultimo_uso: str | None = None,
    ) -> list[AudienciaSegmentoItem]:
        params = {
            "sexo": sexo,
            "edad_min": edad_min,
            "edad_max": edad_max,
            "ciudad": ciudad,
            "departamento": departamento,
            "concepto": concepto,
            "servicio": servicio,
            "tipo_vinculacion": tipo_vinculacion,
            "ultimo_uso": ultimo_uso,
        }
        filas = self.db.execute(text(_SQL_AUDIENCIA), params).mappings().all()
        items: list[AudienciaSegmentoItem] = []
        for fila in filas:
            datos = {clave.upper(): valor for clave, valor in fila.items()}
            datos.pop("RN", None)
            if "ULTIMO_USO" in datos:
                datos["ULTIMO_USO"] = _fecha_iso(datos["ULTIMO_USO"])
            if datos.get("EDAD") is not None:
                datos["EDAD"] = int(datos["EDAD"])
            if datos.get("SERVICIOS_USADOS") is not None:
                datos["SERVICIOS_USADOS"] = int(datos["SERVICIOS_USADOS"])
            items.append(AudienciaSegmentoItem(**datos))
        return items
