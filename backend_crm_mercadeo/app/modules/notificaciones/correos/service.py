import json
import logging

from sqlalchemy.orm import Session

from app.core.email import enviar_correo_plantilla
from app.models import Importacion
from app.modules.notificaciones.correos.repository import CorreosRepository
from app.modules.notificaciones.correos.schemas import (
    EnvioRecordatoriosResultado,
    EstadoUltimoEnvio,
    FalloEnvio,
    HistorialEnvioItem,
    ListadoTitularesPorVencer,
    TitularPorVencer,
)

logger = logging.getLogger(__name__)

PLANTILLA_VENCIMIENTO = "Vencimiento (1).html"
ASUNTO_VENCIMIENTO = "Tu membresía Plan Liga está por vencer"


class CorreosService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = CorreosRepository(db)

    # ------------------------------------------------------------------
    # Estado / historial (mercadeo_crm_historial_procesos)
    # ------------------------------------------------------------------
    @staticmethod
    def _fallos_de(fila: Importacion) -> list[FalloEnvio]:
        if not fila.detalle_errores:
            return []
        try:
            return [FalloEnvio(**f) for f in json.loads(fila.detalle_errores)]
        except (ValueError, TypeError):
            return []

    def _estado_envio(self) -> EstadoUltimoEnvio:
        fila = self.repository.ultimo_envio_vencimiento()
        if fila is None:
            return EstadoUltimoEnvio()
        return EstadoUltimoEnvio(
            ultimo_envio=fila.fecha,
            ultimo_total=(fila.registros or 0) + (fila.errores or 0),
            ultimo_enviados=fila.registros,
            ultimo_fallidos=fila.errores,
            ejecutado_por=fila.usuario.usuario if fila.usuario else None,
        )

    def historial_envios(self, limit: int = 20) -> list[HistorialEnvioItem]:
        filas = self.repository.historial_envios_vencimiento(limit)
        return [
            HistorialEnvioItem(
                fecha=fila.fecha,
                enviados=fila.registros or 0,
                fallidos=fila.errores or 0,
                total=(fila.registros or 0) + (fila.errores or 0),
                ejecutado_por=fila.usuario.usuario if fila.usuario else None,
                fallos=self._fallos_de(fila),
            )
            for fila in filas
        ]

    # ------------------------------------------------------------------
    # Listado (preparar, no envia)
    # ------------------------------------------------------------------
    def listar_titulares_por_vencer(
        self,
        dias_previos: int = 7,
        dias_vencidos: int = 1,
        solo_con_correo: bool = True,
    ) -> ListadoTitularesPorVencer:
        filas = self.repository.listar_titulares_por_vencer(
            dias_previos, dias_vencidos, solo_con_correo
        )
        return ListadoTitularesPorVencer(
            total=len(filas),
            dias_previos=dias_previos,
            dias_vencidos=dias_vencidos,
            estado_envio=self._estado_envio(),
            items=[self._a_item(f) for f in filas],
        )

    @staticmethod
    def _a_item(fila: dict) -> TitularPorVencer:
        # El dialecto de Oracle normaliza los nombres de columna de un text()
        # a minusculas; el schema los espera en mayusculas.
        datos = {clave.upper(): valor for clave, valor in fila.items()}
        dias = int(datos["DIAS"])
        datos["DIAS"] = dias
        datos["VENCIDO"] = dias < 0
        return TitularPorVencer(**datos)

    # ------------------------------------------------------------------
    # Envio (boton manual)
    # ------------------------------------------------------------------
    def enviar_recordatorios_vencimiento(
        self,
        username: str,
        dias_previos: int = 7,
        dias_vencidos: int = 1,
    ) -> EnvioRecordatoriosResultado:
        """Envia el correo de vencimiento a cada titular por vencer (solo los
        que tienen correo), renderizando la plantilla con sus datos. El envio
        es best-effort por destinatario: si uno falla, se sigue con el resto.
        Registra el resultado como una fila nueva del historial (no pisa las
        corridas anteriores)."""
        filas = self.repository.listar_titulares_por_vencer(
            dias_previos, dias_vencidos, solo_con_correo=True
        )

        enviados = 0
        fallos: list[FalloEnvio] = []
        for fila in filas:
            item = self._a_item(fila)
            try:
                enviar_correo_plantilla(
                    destinatarios=[item.CORREO],
                    asunto=ASUNTO_VENCIMIENTO,
                    plantilla=PLANTILLA_VENCIMIENTO,
                    variables={
                        "nombre": item.NOMBRE or "",
                        "dias": item.DIAS,
                        "fecha_fin": item.FECHA_FIN_TXT,
                    },
                )
                enviados += 1
            except Exception as exc:  # noqa: BLE001 - best effort por destinatario
                logger.exception(
                    "Fallo el correo de vencimiento a %s (%s)",
                    item.DOCUMENTO,
                    item.CORREO,
                )
                fallos.append(
                    FalloEnvio(
                        DOCUMENTO=item.DOCUMENTO,
                        NOMBRE=item.NOMBRE,
                        CORREO=item.CORREO,
                        error=str(exc),
                    )
                )

        usuario_id = self.repository.obtener_usuario_id(username)
        self.repository.registrar_envio_vencimiento(
            enviados,
            len(fallos),
            [f.model_dump() for f in fallos],
            usuario_id,
        )

        return EnvioRecordatoriosResultado(
            total=len(filas),
            enviados=enviados,
            fallidos=len(fallos),
            fallos=fallos,
            estado_envio=self._estado_envio(),
        )
