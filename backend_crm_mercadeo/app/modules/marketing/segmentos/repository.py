from datetime import date, datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from .schemas import AudienciaSegmentoItem

# Consolidado de marketing: servicios clinicos (TMPBI1) cruzados con
# afiliados activos de Plan Liga (INTRANET_VISTA_PLANLIGA). Una fila por
# persona (RN=1 = ultimo servicio). Sin ORDER BY/paginacion: eso se agrega
# en _ejecutar_pagina/_contar segun haga falta (ver mas abajo).
_SQL_AUDIENCIA = """
SELECT
    IDENTIFICACION,
    NOMBRES,
    EMPRESA,
    SEXO,
    EDAD,
    CIUDAD,
    DEPARTAMENTO,
    CORREO,
    TELEFONO,
    TIPO_PLAN,
    CONCEPTO,
    SERVICIO,
    ESPECIALIDAD,
    SERVICIOS_USADOS,
    ULTIMO_USO,
    TIPO_VINCULACION
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
        p.TIPO_PLAN,
        t.CONCEPTO,
        t.SERVICIO,
        t.ESPECIALIDAD,
        COUNT(*) OVER (PARTITION BY t.IDENTIFICACION) AS SERVICIOS_USADOS,
        MAX(t.FECHA) OVER (PARTITION BY t.IDENTIFICACION) AS ULTIMO_USO,
        CASE
            WHEN UPPER(p.TIPO_PLAN) = 'PARTICULAR' THEN 'Particular'
            ELSE 'Empresa'
        END AS TIPO_VINCULACION,
        ROW_NUMBER() OVER (
            PARTITION BY t.IDENTIFICACION
            ORDER BY t.FECHA DESC
        ) AS RN
    FROM TMPBI1 t
    INNER JOIN (
        SELECT DISTINCT DOCUMENTO, ESTADO, TIPO_PLAN
        FROM INTRANET_VISTA_PLANLIGA
    ) p
        ON p.DOCUMENTO = t.IDENTIFICACION
    WHERE p.ESTADO = 'A'
      AND (:sexo IS NULL OR UPPER(t.SEXO) = UPPER(:sexo))
      AND (:edad_min IS NULL OR t.EDAD >= :edad_min)
      AND (:edad_max IS NULL OR t.EDAD <= :edad_max)
      AND (:ciudad IS NULL OR UPPER(TRIM(t.MUNICIPIO)) = UPPER(:ciudad))
      AND (:departamento IS NULL OR UPPER(TRIM(t.DEPARTAMENTO)) = UPPER(:departamento))
      AND (:concepto IS NULL OR UPPER(TRIM(t.CONCEPTO)) = UPPER(:concepto))
      AND (:servicio IS NULL OR UPPER(TRIM(t.SERVICIO)) = UPPER(:servicio))
      AND (
            :tipo_vinculacion IS NULL
            OR (UPPER(:tipo_vinculacion) = 'PARTICULAR' AND UPPER(p.TIPO_PLAN) = 'PARTICULAR')
            OR (
                UPPER(:tipo_vinculacion) = 'EMPRESA'
                AND (p.TIPO_PLAN IS NULL OR UPPER(p.TIPO_PLAN) != 'PARTICULAR')
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
"""

# Consolidado "no Plan Liga": mismo cruce con TMPBI1, pero la audiencia
# sale de ABPAC (personas con historia clinica/usuario Servinte, campo
# PACIDE = cedula) EXCLUYENDO a quienes son afiliados ACTIVOS de Plan Liga
# (INTRANET_VISTA_PLANLIGA.ESTADO = 'A'). Un inactivo de Plan Liga si cae
# en esta audiencia.
#
# IMPORTANTE (rendimiento): el filtrado de TMPBI1 (concepto/servicio/sexo/etc)
# va primero en el WHERE y el INNER JOIN a ABPAC + el NOT EXISTS contra
# INTRANET_VISTA_PLANLIGA se evaluan por cada fila de TMPBI1 ya filtrada, NO
# sobre toda la tabla ABPAC completa (esa version anterior escaneaba ABPAC
# entero antes de aplicar cualquier filtro y quedaba colgada).
_SQL_AUDIENCIA_NO_PLAN_LIGA = """
SELECT
    IDENTIFICACION,
    NOMBRES,
    EMPRESA,
    SEXO,
    EDAD,
    CIUDAD,
    DEPARTAMENTO,
    CORREO,
    TELEFONO,
    TIPO_PLAN,
    CONCEPTO,
    SERVICIO,
    ESPECIALIDAD,
    SERVICIOS_USADOS,
    ULTIMO_USO,
    TIPO_VINCULACION
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
    INNER JOIN ABPAC a
        ON a.PACIDE = t.IDENTIFICACION
    WHERE NOT EXISTS (
            SELECT 1
            FROM INTRANET_VISTA_PLANLIGA p
            WHERE p.DOCUMENTO = t.IDENTIFICACION
              AND p.ESTADO = 'A'
      )
      AND (:sexo IS NULL OR UPPER(t.SEXO) = UPPER(:sexo))
      AND (:edad_min IS NULL OR t.EDAD >= :edad_min)
      AND (:edad_max IS NULL OR t.EDAD <= :edad_max)
      AND (:ciudad IS NULL OR UPPER(TRIM(t.MUNICIPIO)) = UPPER(:ciudad))
      AND (:departamento IS NULL OR UPPER(TRIM(t.DEPARTAMENTO)) = UPPER(:departamento))
      AND (:concepto IS NULL OR UPPER(TRIM(t.CONCEPTO)) = UPPER(:concepto))
      AND (:servicio IS NULL OR UPPER(TRIM(t.SERVICIO)) = UPPER(:servicio))
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
"""

# COUNT(*) OVER() (sin PARTITION BY) calcula el total de filas que cumplen
# el filtro ANTES de recortar con OFFSET/FETCH -- Oracle evalua las funciones
# de ventana sobre el resultado completo y recien al final aplica el recorte
# de pagina, asi que el total sale correcto en la MISMA pasada, sin repetir
# el join+ventanas caros de sql_base con una segunda consulta de COUNT(*).
_SQL_PAGINA = """
SELECT x.*, COUNT(*) OVER () AS TOTAL_FILAS
FROM (
    {base}
) x
ORDER BY x.ULTIMO_USO DESC NULLS LAST
OFFSET :offset ROWS FETCH NEXT :limite ROWS ONLY
"""

# Valores distintos para poblar los desplegables de filtro (ciudad, concepto,
# servicio). TMPBI1 tiene ~5 millones de filas, asi que esto tambien puede
# ser lento -- el service lo cachea en memoria para no pegarle a la tabla
# en cada carga del panel de filtros (ver SegmentosService).
_SQL_VALORES_MUNICIPIO = """
SELECT DISTINCT UPPER(TRIM(MUNICIPIO)) AS VALOR
FROM TMPBI1
WHERE TRIM(MUNICIPIO) IS NOT NULL
ORDER BY VALOR
"""

_SQL_VALORES_CONCEPTO = """
SELECT DISTINCT UPPER(TRIM(CONCEPTO)) AS VALOR
FROM TMPBI1
WHERE TRIM(CONCEPTO) IS NOT NULL
ORDER BY VALOR
"""

_SQL_VALORES_SERVICIO = """
SELECT DISTINCT UPPER(TRIM(SERVICIO)) AS VALOR
FROM TMPBI1
WHERE TRIM(SERVICIO) IS NOT NULL
ORDER BY VALOR
"""

# Pares (departamento, municipio) distintos, para el desplegable en cascada:
# primero elige departamento, y el de municipio se filtra a los que
# pertenecen a ese departamento (todo se trae una sola vez y se filtra en
# el frontend, en vez de volver a consultar TMPBI1 por cada departamento).
_SQL_UBICACIONES = """
SELECT DISTINCT
    UPPER(TRIM(DEPARTAMENTO)) AS DEPARTAMENTO,
    UPPER(TRIM(MUNICIPIO)) AS MUNICIPIO
FROM TMPBI1
WHERE TRIM(DEPARTAMENTO) IS NOT NULL
  AND TRIM(MUNICIPIO) IS NOT NULL
ORDER BY DEPARTAMENTO, MUNICIPIO
"""

# Pares (concepto, servicio) distintos, para el mismo patron en cascada:
# primero elige concepto, y el desplegable de servicio se filtra a los
# servicios que realmente pertenecen a ese concepto en TMPBI1 (antes el
# desplegable de servicio mostraba TODOS los servicios sin importar el
# concepto elegido).
_SQL_CONCEPTOS_SERVICIOS = """
SELECT DISTINCT
    UPPER(TRIM(CONCEPTO)) AS CONCEPTO,
    UPPER(TRIM(SERVICIO)) AS SERVICIO
FROM TMPBI1
WHERE TRIM(CONCEPTO) IS NOT NULL
  AND TRIM(SERVICIO) IS NOT NULL
ORDER BY CONCEPTO, SERVICIO
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

    def _mapear(self, filas) -> tuple[list[AudienciaSegmentoItem], int]:
        items: list[AudienciaSegmentoItem] = []
        total = 0
        for fila in filas:
            datos = {clave.upper(): valor for clave, valor in fila.items()}
            datos.pop("RN", None)
            total = int(datos.pop("TOTAL_FILAS", 0) or 0)
            if "ULTIMO_USO" in datos:
                datos["ULTIMO_USO"] = _fecha_iso(datos["ULTIMO_USO"])
            if datos.get("EDAD") is not None:
                datos["EDAD"] = int(datos["EDAD"])
            if datos.get("SERVICIOS_USADOS") is not None:
                datos["SERVICIOS_USADOS"] = int(datos["SERVICIOS_USADOS"])
            items.append(AudienciaSegmentoItem(**datos))
        return items, total

    def _ejecutar_pagina(
        self, sql_base: str, params: dict, pagina: int, por_pagina: int
    ) -> tuple[list[AudienciaSegmentoItem], int]:
        """Una sola consulta: trae la pagina pedida y, en la misma pasada,
        el total real via COUNT(*) OVER() (ver _SQL_PAGINA). Si la pagina
        pedida queda vacia (ultima pagina mas alla del total, o sin
        resultados), el total tambien se pierde -- para eso, si la pagina
        pedida no es la primera, se repite solo el conteo (mucho mas barato
        que repetir sql_base+pagina) para no reportar total=0 por error."""
        offset = (pagina - 1) * por_pagina
        params_pagina = {**params, "offset": offset, "limite": por_pagina}
        sql = _SQL_PAGINA.format(base=sql_base)
        filas = self.db.execute(text(sql), params_pagina).mappings().all()
        items, total = self._mapear(filas)

        if not items and pagina > 1:
            total = self.db.scalar(text(f"SELECT COUNT(*) FROM ({sql_base})"), params) or 0

        return items, total

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
        pagina: int = 1,
        por_pagina: int = 10,
    ) -> tuple[list[AudienciaSegmentoItem], int]:
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
        return self._ejecutar_pagina(_SQL_AUDIENCIA, params, pagina, por_pagina)

    def listar_audiencia_no_plan_liga(
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
        pagina: int = 1,
        por_pagina: int = 10,
    ) -> tuple[list[AudienciaSegmentoItem], int]:
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
        return self._ejecutar_pagina(
            _SQL_AUDIENCIA_NO_PLAN_LIGA, params, pagina, por_pagina
        )

    def _valores_distintos(self, sql: str) -> list[str]:
        filas = self.db.execute(text(sql)).scalars().all()
        return [valor for valor in filas if valor]

    def listar_ciudades(self) -> list[str]:
        return self._valores_distintos(_SQL_VALORES_MUNICIPIO)

    def listar_conceptos(self) -> list[str]:
        return self._valores_distintos(_SQL_VALORES_CONCEPTO)

    def listar_servicios(self) -> list[str]:
        return self._valores_distintos(_SQL_VALORES_SERVICIO)

    def _pares_distintos(self, sql: str, clave_a: str, clave_b: str) -> list[dict[str, str]]:
        """Como _valores_distintos pero para 2 columnas relacionadas (ver
        listar_ubicaciones/listar_conceptos_servicios). El driver de Oracle
        puede devolver las claves en minuscula: se normaliza a mayuscula
        antes de acceder por nombre (igual que en _mapear)."""
        filas = self.db.execute(text(sql)).mappings().all()
        resultado = []
        for fila in filas:
            datos = {clave.upper(): valor for clave, valor in fila.items()}
            valor_a = datos.get(clave_a.upper())
            valor_b = datos.get(clave_b.upper())
            if valor_a and valor_b:
                resultado.append({clave_a: valor_a, clave_b: valor_b})
        return resultado

    def listar_ubicaciones(self) -> list[dict[str, str]]:
        """Pares (departamento, municipio) distintos, para el desplegable
        en cascada de Departamento -> Ciudad/municipio."""
        return self._pares_distintos(_SQL_UBICACIONES, "departamento", "municipio")

    def listar_conceptos_servicios(self) -> list[dict[str, str]]:
        """Pares (concepto, servicio) distintos, para el desplegable en
        cascada de Concepto -> Servicio."""
        return self._pares_distintos(_SQL_CONCEPTOS_SERVICIOS, "concepto", "servicio")
