from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_username
from app.core.email import enviar_correo_plantilla
from app.modules.notificaciones.correos.dependencies import get_correos_service
from app.modules.notificaciones.correos.schemas import (
    CorreoBienvenida,
    CorreoEnviadoResultado,
    CorreoRegistro,
    EnvioRecordatoriosResultado,
    HistorialEnvioItem,
    ListadoTitularesPorVencer,
)
from app.modules.notificaciones.correos.service import CorreosService

router = APIRouter(
    prefix="/correos", tags=["Correos"], dependencies=[Depends(get_current_username)]
)

PLANTILLA_BIENVENIDA = "Bienvenida (1).html"
PLANTILLA_REGISTRO = "Registro (1).html"
PLANTILLA_VENCIMIENTO = "Vencimiento (1).html"


# Envio manual/bajo demanda: alguien en el CRM lo dispara para un beneficiario puntual.
# La plantilla ya trae fijo "Vigencia: 1 año" (el año de plan corre desde la fecha de
# ingreso del titular, que es la misma para todo su grupo de beneficiarios).
@router.post("/bienvenida", response_model=CorreoEnviadoResultado)
def enviar_bienvenida(data: CorreoBienvenida) -> CorreoEnviadoResultado:
    lista_html = f'<li style="margin: 0 0 8px 0;">{data.NOMBRE}</li>'
    enviar_correo_plantilla(
        destinatarios=[data.CORREO],
        asunto="Bienvenido(a) a la membresía Plan Liga",
        plantilla=PLANTILLA_BIENVENIDA,
        variables={"lista": lista_html},
    )
    return CorreoEnviadoResultado()


# Tambien se llama automaticamente al crear un titular (ver
# titulares_beneficiarios/service.py -> crear_titular), ademas de poder dispararse
# manual desde aca si hace falta reenviarlo.
@router.post("/registro", response_model=CorreoEnviadoResultado)
def enviar_registro(data: CorreoRegistro) -> CorreoEnviadoResultado:
    enviar_correo_plantilla(
        destinatarios=[data.CORREO],
        asunto="Completa tu registro - Membresía Plan Liga",
        plantilla=PLANTILLA_REGISTRO,
        variables={"nombre": data.NOMBRE},
    )
    return CorreoEnviadoResultado()


# Lista los titulares con plan por vencer / recien vencido (excluye TIPO_PLAN
# 'LIGA' = empleados). Cada item trae NOMBRE / DIAS / FECHA_FIN_TXT listos para
# la plantilla "Vencimiento (1).html", mas el estado de la ultima corrida de
# envio. NO envia nada.
@router.get("/vencimiento/pendientes", response_model=ListadoTitularesPorVencer)
def listar_pendientes_vencimiento(
    dias_previos: int = 7,
    dias_vencidos: int = 1,
    solo_con_correo: bool = True,
    service: CorreosService = Depends(get_correos_service),
) -> ListadoTitularesPorVencer:
    return service.listar_titulares_por_vencer(
        dias_previos, dias_vencidos, solo_con_correo
    )


# Boton manual: envia el correo de vencimiento a cada titular por vencer (solo
# los que tienen correo), renderizando la plantilla con sus datos. Best-effort
# por destinatario. Guarda la fecha/resultado de esta corrida.
@router.post("/vencimiento/enviar", response_model=EnvioRecordatoriosResultado)
def enviar_recordatorios_vencimiento(
    dias_previos: int = 7,
    dias_vencidos: int = 1,
    username: str = Depends(get_current_username),
    service: CorreosService = Depends(get_correos_service),
) -> EnvioRecordatoriosResultado:
    return service.enviar_recordatorios_vencimiento(
        username, dias_previos, dias_vencidos
    )


# Historial de corridas pasadas (cada click de "Enviar recordatorios" queda
# como una fila en mercadeo_crm_historial_procesos, tipo 'correo_vencimiento_plan_liga').
@router.get("/vencimiento/historial", response_model=list[HistorialEnvioItem])
def historial_vencimiento(
    limit: int = 20,
    service: CorreosService = Depends(get_correos_service),
) -> list[HistorialEnvioItem]:
    return service.historial_envios(limit)
