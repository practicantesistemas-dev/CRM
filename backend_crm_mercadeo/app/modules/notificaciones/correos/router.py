from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_username
from app.core.email import enviar_correo_plantilla
from app.modules.notificaciones.correos.schemas import (
    CorreoBienvenida,
    CorreoEnviadoResultado,
    CorreoRegistro,
)

router = APIRouter(
    prefix="/correos", tags=["Correos"], dependencies=[Depends(get_current_username)]
)

PLANTILLA_BIENVENIDA = "Bienvenida (1).html"
PLANTILLA_REGISTRO = "Registro (1).html"


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
