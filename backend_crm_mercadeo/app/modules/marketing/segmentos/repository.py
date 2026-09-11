from sqlalchemy import bindparam, text
from sqlalchemy.orm import Session

ESTADOS_FILTRO = {"activo": "A", "inactivo": "I"}

# INTRANET_PLANLIGA.CIUDAD/DEPARTAMENTO NO guardan el nombre: guardan el
# codigo DIVIPOLA partido en dos columnas (depto 2 digitos + municipio 3
# digitos, ej. '66' + '001' = Pereira). Para filtrar/mostrar el nombre hay
# que re-armar ese codigo de 5 digitos y cruzarlo contra INMUN/INDEP, los
# mismos catalogos que usa app/modules/compartidos/ubicaciones/repository.py
# (por eso 'ciudades' en este modulo recibe el MUNCOD completo, ej. '66001',
# tal como lo devuelve GET /compartidos/ubicaciones/municipios).
#
# El CASE con REGEXP_LIKE es defensivo: evita que una fila con CIUDAD o
# DEPARTAMENTO sucios (vacios, con letras, con ceros de mas como se vio en
# produccion) rompa la consulta o matchee mal; simplemente no cruza y esa
# fila sale con CIUDAD/DEPARTAMENTO en NULL.
_JOIN_UBICACION = """
    LEFT JOIN INMUN m ON m.MUNCOD = (
        CASE
            WHEN REGEXP_LIKE(p.DEPARTAMENTO, '^[0-9]{1,2}$')
             AND REGEXP_LIKE(p.CIUDAD, '^[0-9]{1,3}$')
            THEN LPAD(TRIM(p.DEPARTAMENTO), 2, '0') || LPAD(TRIM(p.CIUDAD), 3, '0')
        END
    )
    LEFT JOIN INDEP d ON d.DEPCOD = m.MUNDEP
"""


class SegmentosRepository:
    """SQL crudo sobre INTRANET_PLANLIGA para el segmentador de campanas
    (modulo Marketing). Solo consulta: no modifica nada."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def _condiciones(
        self,
        estado: str | None,
        sexo: str | None,
        edad_min: int | None,
        edad_max: int | None,
        ciudades: list[str] | None,
        vinculacion: str | None,
    ) -> tuple[str, dict]:
        condiciones: list[str] = []
        params: dict = {}

        codigo_estado = ESTADOS_FILTRO.get((estado or "").lower())
        if codigo_estado:
            condiciones.append("p.ESTADO = :estado")
            params["estado"] = codigo_estado

        if sexo:
            condiciones.append("p.SEXO = :sexo")
            params["sexo"] = sexo.upper()

        if edad_min is not None:
            condiciones.append(
                "TRUNC(MONTHS_BETWEEN(SYSDATE, p.FECHA_NACIMIENTO) / 12) >= :edad_min"
            )
            params["edad_min"] = edad_min

        if edad_max is not None:
            condiciones.append(
                "TRUNC(MONTHS_BETWEEN(SYSDATE, p.FECHA_NACIMIENTO) / 12) <= :edad_max"
            )
            params["edad_max"] = edad_max

        if ciudades:
            condiciones.append("m.MUNCOD IN :ciudades")
            params["ciudades"] = list(ciudades)

        if vinculacion == "particular":
            condiciones.append("NVL(TRIM(p.EMPRESA), ' ') = ' '")
        elif vinculacion == "empresa":
            condiciones.append("NVL(TRIM(p.EMPRESA), ' ') <> ' '")

        where = ("WHERE " + " AND ".join(condiciones)) if condiciones else ""
        return where, params

    def _bind(self, stmt, params: dict):
        if "ciudades" in params:
            stmt = stmt.bindparams(bindparam("ciudades", expanding=True))
        return stmt

    def contar_titulares(
        self,
        estado: str | None = None,
        sexo: str | None = None,
        edad_min: int | None = None,
        edad_max: int | None = None,
        ciudades: list[str] | None = None,
        vinculacion: str | None = None,
    ) -> int:
        where, params = self._condiciones(
            estado, sexo, edad_min, edad_max, ciudades, vinculacion
        )
        stmt = self._bind(
            text(
                f"""
                SELECT COUNT(*)
                FROM INTRANET_PLANLIGA p
                {_JOIN_UBICACION}
                {where}
                """
            ),
            params,
        )
        return self.db.execute(stmt, params).scalar() or 0

    def listar_titulares(
        self,
        offset: int,
        limit: int,
        estado: str | None = None,
        sexo: str | None = None,
        edad_min: int | None = None,
        edad_max: int | None = None,
        ciudades: list[str] | None = None,
        vinculacion: str | None = None,
    ) -> list[dict]:
        where, params = self._condiciones(
            estado, sexo, edad_min, edad_max, ciudades, vinculacion
        )
        params = {**params, "desplazamiento": offset, "cantidad": limit}
        stmt = self._bind(
            text(
                f"""
                SELECT
                    p.ID AS ID_TITULAR,
                    p.TIPO AS TIPO_DOCUMENTO,
                    p.DOCUMENTO,
                    TRIM(p.NOMBRE1 || ' ' || NVL(p.NOMBRE2, '') || ' '
                         || NVL(p.APELLIDO1, '') || ' ' || NVL(p.APELLIDO2, '')) AS NOMBRE,
                    p.SEXO,
                    TRUNC(MONTHS_BETWEEN(SYSDATE, p.FECHA_NACIMIENTO) / 12) AS EDAD,
                    m.MUNNOM AS CIUDAD,
                    d.DEPNOM AS DEPARTAMENTO,
                    p.TIPO_PLAN,
                    p.EMPRESA,
                    CASE WHEN NVL(TRIM(p.EMPRESA), ' ') = ' '
                         THEN 'Particular' ELSE 'Empresa' END AS VINCULACION,
                    p.CORREO,
                    p.TELEFONO,
                    p.ESTADO,
                    TO_CHAR(p.FECHA_INGRESO, 'YYYY-MM-DD') AS FECHA_INGRESO
                FROM INTRANET_PLANLIGA p
                {_JOIN_UBICACION}
                {where}
                ORDER BY NOMBRE
                OFFSET :desplazamiento ROWS FETCH NEXT :cantidad ROWS ONLY
                """
            ),
            params,
        )
        # El dialecto de Oracle normaliza los nombres de columna de un text()
        # a minusculas (ver mismo comentario en notificaciones/correos/service.py);
        # el schema Pydantic los espera en mayuscula.
        filas = self.db.execute(stmt, params).mappings().all()
        return [{clave.upper(): valor for clave, valor in fila.items()} for fila in filas]
