import json
import logging
from datetime import date, datetime, timedelta, timezone

# Las fechas que este backend escribe son UTC (datetime.now(timezone.utc)), pero
# Oracle las devuelve "naive". Se les vuelve a marcar UTC antes de serializarlas
# para que el frontend (new Date()) las convierta bien a hora local.

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


def _a_fecha(valor) -> date | None:
    if valor is None:
        return None
    return valor.date() if isinstance(valor, datetime) else valor


def _utc(dt: datetime | None) -> datetime | None:
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


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

    @staticmethod
    def _rango_de(fila: Importacion) -> tuple[int | None, int | None]:
        """Ventana de dias guardada en `avisos` como JSON."""
        if not fila.avisos:
            return None, None
        try:
            meta = json.loads(fila.avisos)
            return meta.get("dias_previos"), meta.get("dias_vencidos")
        except (ValueError, TypeError):
            return None, None

    def _estado_envio(self) -> EstadoUltimoEnvio:
        fila = self.repository.ultimo_envio_vencimiento()
        intervalos = self.repository.intervalos_cubiertos()
        cubierto_desde = min((a for a, _ in intervalos), default=None)
        cubierto_hasta = max((b for _, b in intervalos), default=None)

        if fila is None:
            return EstadoUltimoEnvio(
                cubierto_desde=cubierto_desde, cubierto_hasta=cubierto_hasta
            )
        prev, venc = self._rango_de(fila)
        return EstadoUltimoEnvio(
            ultimo_envio=_utc(fila.fecha),
            ultimo_total=(fila.registros or 0) + (fila.errores or 0),
            ultimo_enviados=fila.registros,
            ultimo_fallidos=fila.errores,
            ejecutado_por=fila.usuario.usuario if fila.usuario else None,
            dias_previos=prev,
            dias_vencidos=venc,
            cubierto_desde=cubierto_desde,
            cubierto_hasta=cubierto_hasta,
        )

    def historial_envios(self, limit: int = 20) -> list[HistorialEnvioItem]:
        filas = self.repository.historial_envios_vencimiento(limit)
        items = []
        for fila in filas:
            prev, venc = self._rango_de(fila)
            items.append(
                HistorialEnvioItem(
                    fecha=_utc(fila.fecha),
                    enviados=fila.registros or 0,
                    fallidos=fila.errores or 0,
                    total=(fila.registros or 0) + (fila.errores or 0),
                    ejecutado_por=fila.usuario.usuario if fila.usuario else None,
                    dias_previos=prev,
                    dias_vencidos=venc,
                    fallos=self._fallos_de(fila),
                )
            )
        return items

    # ------------------------------------------------------------------
    # Listado (preparar, no envia)
    # ------------------------------------------------------------------
    @staticmethod
    def _ya_cubierta(fecha_fin: date | None, intervalos: list[tuple[date, date]]) -> bool:
        if fecha_fin is None:
            return False
        return any(desde <= fecha_fin <= hasta for desde, hasta in intervalos)

    def _a_item(
        self, fila: dict, intervalos: list[tuple[date, date]]
    ) -> TitularPorVencer:
        # El dialecto de Oracle normaliza los nombres de columna de un text()
        # a minusculas; el schema los espera en mayusculas.
        datos = {clave.upper(): valor for clave, valor in fila.items()}
        dias = int(datos["DIAS"])
        datos["DIAS"] = dias
        datos["VENCIDO"] = dias < 0
        datos["YA_ENVIADO"] = self._ya_cubierta(
            _a_fecha(datos.get("FECHA_FIN")), intervalos
        )
        return TitularPorVencer(**datos)

    def listar_titulares_por_vencer(
        self,
        dias_previos: int = 7,
        dias_vencidos: int = 0,
        solo_con_correo: bool = True,
    ) -> ListadoTitularesPorVencer:
        intervalos = self.repository.intervalos_cubiertos()
        filas = self.repository.listar_titulares_por_vencer(
            dias_previos, dias_vencidos, solo_con_correo
        )
        items = [self._a_item(f, intervalos) for f in filas]
        nuevos = sum(1 for i in items if not i.YA_ENVIADO)
        return ListadoTitularesPorVencer(
            total=len(items),
            nuevos=nuevos,
            ya_enviados=len(items) - nuevos,
            dias_previos=dias_previos,
            dias_vencidos=dias_vencidos,
            estado_envio=self._estado_envio(),
            items=items,
        )

    # ------------------------------------------------------------------
    # Envio (boton manual)
    # ------------------------------------------------------------------
    def enviar_recordatorios_vencimiento(
        self,
        username: str,
        dias_previos: int = 7,
        dias_vencidos: int = 0,
        incluir_ya_enviados: bool = False,
    ) -> EnvioRecordatoriosResultado:
        """Envia el correo de vencimiento a los titulares de la ventana pedida.

        Por defecto SOLO a los que todavia no lo recibieron (su FECHA_FIN no
        cae en ningun rango ya cubierto por un envio anterior). Con
        `incluir_ya_enviados=True` se reenvia a todos los de la ventana.

        Best-effort por destinatario. Registra la corrida en el historial y
        marca el rango [hoy - dias_vencidos, hoy + dias_previos] como cubierto.
        """
        intervalos = self.repository.intervalos_cubiertos()
        filas = self.repository.listar_titulares_por_vencer(
            dias_previos, dias_vencidos, solo_con_correo=True
        )
        items = [self._a_item(f, intervalos) for f in filas]

        if incluir_ya_enviados:
            a_enviar = items
        else:
            a_enviar = [i for i in items if not i.YA_ENVIADO]
        omitidos = len(items) - len(a_enviar)

        enviados = 0
        fallos: list[FalloEnvio] = []
        for item in a_enviar:
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

        hoy = datetime.now(timezone.utc).date()
        usuario_id = self.repository.obtener_usuario_id(username)
        self.repository.registrar_envio_vencimiento(
            enviados,
            len(fallos),
            [f.model_dump() for f in fallos],
            usuario_id,
            dias_previos,
            dias_vencidos,
            cubre_desde=hoy - timedelta(days=dias_vencidos),
            cubre_hasta=hoy + timedelta(days=dias_previos),
        )

        return EnvioRecordatoriosResultado(
            total=len(items),
            a_enviar=len(a_enviar),
            enviados=enviados,
            fallidos=len(fallos),
            omitidos_ya_enviados=omitidos,
            fallos=fallos,
            estado_envio=self._estado_envio(),
        )
