import json
from datetime import datetime, timezone

from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from app.models import Importacion, Usuario

# `tipo` que distingue las filas de recordatorio de vencimiento dentro de
# mercadeo_crm_historial_procesos (tabla compartida con el modulo de
# importaciones, ver comentario en app/models.py sobre Importacion).
TIPO_HISTORIAL_VENCIMIENTO = "correo_vencimiento_plan_liga"


class CorreosRepository:
    """SQL crudo para los datos que alimentan los correos (FECHA_FIN es una
    columna de INTRANET_PLANLIGA que no esta mapeada en el ORM) + el
    historial de envios sobre la tabla compartida mercadeo_crm_historial_procesos."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def listar_titulares_por_vencer(
        self,
        dias_previos: int = 7,
        dias_vencidos: int = 1,
        solo_con_correo: bool = True,
    ) -> list[dict]:
        """Titulares ACTIVOS cuyo plan vence entre `dias_vencidos` dias en el
        pasado y `dias_previos` dias en el futuro.

        La fecha de vencimiento se calcula como FECHA_INGRESO + 12 meses (el
        plan dura 1 ano desde la activacion). No se usa una columna FECHA_FIN
        porque no existe en todas las bases (solo en 'scse', no en 'Ligapru').

        Se excluyen los titulares con TIPO_PLAN 'LIGA': son empleados de la
        Liga, no se les manda recordatorio de renovacion.

        DIAS es negativo si ya vencio (ej. -1 = vencio ayer), 0 si vence hoy.
        """
        stmt = text(
            """
            SELECT
                p.ID,
                p.TIPO,
                p.DOCUMENTO,
                TRIM(p.NOMBRE1 || ' ' || p.NOMBRE2 || ' ' || p.APELLIDO1 || ' ' || p.APELLIDO2) AS NOMBRE,
                p.CORREO,
                p.TELEFONO,
                p.EMPRESA,
                p.TIPO_PLAN,
                TRUNC(p.FECHA_INGRESO)                              AS FECHA_INGRESO,
                TRUNC(ADD_MONTHS(p.FECHA_INGRESO, 12))              AS FECHA_FIN,
                TRUNC(ADD_MONTHS(p.FECHA_INGRESO, 12)) - TRUNC(SYSDATE)   AS DIAS,
                TO_CHAR(ADD_MONTHS(p.FECHA_INGRESO, 12), 'DD/MM/YYYY')    AS FECHA_FIN_TXT,
                p.RENOVADO
            FROM INTRANET_PLANLIGA p
            WHERE p.ESTADO = 'A'
              AND p.FECHA_INGRESO IS NOT NULL
              AND UPPER(TRIM(NVL(p.TIPO_PLAN, ' '))) <> 'LIGA'
              AND TRUNC(ADD_MONTHS(p.FECHA_INGRESO, 12))
                    BETWEEN TRUNC(SYSDATE) - :dias_vencidos
                        AND TRUNC(SYSDATE) + :dias_previos
              AND (:solo_con_correo = 0
                   OR (p.CORREO IS NOT NULL AND INSTR(p.CORREO, '@') > 0))
            ORDER BY FECHA_FIN, NOMBRE
            """
        )
        filas = (
            self.db.execute(
                stmt,
                {
                    "dias_previos": dias_previos,
                    "dias_vencidos": dias_vencidos,
                    "solo_con_correo": 1 if solo_con_correo else 0,
                },
            )
            .mappings()
            .all()
        )
        return [dict(fila) for fila in filas]

    # ------------------------------------------------------------------
    # Historial de envios (mercadeo_crm_historial_procesos, tipo = TIPO_HISTORIAL_VENCIMIENTO)
    # ------------------------------------------------------------------
    def obtener_usuario_id(self, username: str) -> int | None:
        stmt = select(Usuario.id).where(
            func.upper(func.trim(Usuario.usuario)) == username.strip().upper()
        )
        return self.db.scalar(stmt)

    def registrar_envio_vencimiento(
        self,
        enviados: int,
        fallidos: int,
        detalle_fallos: list[dict],
        usuario_id: int | None,
    ) -> Importacion:
        fila = Importacion(
            tipo=TIPO_HISTORIAL_VENCIMIENTO,
            archivo=None,
            registros=enviados,
            errores=fallidos,
            detalle_errores=json.dumps(detalle_fallos, ensure_ascii=False),
            avisos=None,
            usuario_id=usuario_id,
            fecha=datetime.now(timezone.utc),
        )
        self.db.add(fila)
        self.db.commit()
        self.db.refresh(fila)
        return fila

    def ultimo_envio_vencimiento(self) -> Importacion | None:
        stmt = (
            select(Importacion)
            .where(Importacion.tipo == TIPO_HISTORIAL_VENCIMIENTO)
            .order_by(Importacion.fecha.desc())
            .limit(1)
        )
        return self.db.scalars(stmt).first()

    def historial_envios_vencimiento(self, limit: int = 20) -> list[Importacion]:
        stmt = (
            select(Importacion)
            .where(Importacion.tipo == TIPO_HISTORIAL_VENCIMIENTO)
            .order_by(Importacion.fecha.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt))
