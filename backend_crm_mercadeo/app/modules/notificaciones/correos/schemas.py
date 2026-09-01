from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class CorreoBienvenida(BaseModel):
    NOMBRE: str
    CORREO: EmailStr


class CorreoRegistro(BaseModel):
    NOMBRE: str
    CORREO: EmailStr


class CorreoEnviadoResultado(BaseModel):
    enviado: bool = True


class TitularPorVencer(BaseModel):
    """Titular activo con el plan proximo a vencer (o recien vencido). Trae
    listo lo que necesita la plantilla de vencimiento: NOMBRE, CORREO, DIAS y
    FECHA_FIN_TXT (mapean a {{ nombre }} / {{ dias }} / {{ fecha_fin }})."""

    ID: int
    TIPO: Optional[str] = None
    DOCUMENTO: Optional[str] = None
    NOMBRE: Optional[str] = None
    CORREO: Optional[str] = None
    TELEFONO: Optional[str] = None
    EMPRESA: Optional[str] = None
    TIPO_PLAN: Optional[str] = None
    FECHA_INGRESO: Optional[date] = None
    FECHA_FIN: Optional[date] = None
    DIAS: int
    FECHA_FIN_TXT: str
    RENOVADO: Optional[str] = None
    VENCIDO: bool


class EstadoUltimoEnvio(BaseModel):
    """Resumen de la ultima corrida del envio de recordatorios (tabla de 1
    fila mercadeo_crm_recordatorio_vencimiento)."""

    ultimo_envio: Optional[datetime] = None
    ultimo_total: Optional[int] = None
    ultimo_enviados: Optional[int] = None
    ultimo_fallidos: Optional[int] = None
    ejecutado_por: Optional[str] = None


class ListadoTitularesPorVencer(BaseModel):
    total: int
    dias_previos: int
    dias_vencidos: int
    estado_envio: EstadoUltimoEnvio
    items: list[TitularPorVencer]


class FalloEnvio(BaseModel):
    DOCUMENTO: Optional[str] = None
    NOMBRE: Optional[str] = None
    CORREO: Optional[str] = None
    error: str


class EnvioRecordatoriosResultado(BaseModel):
    total: int
    enviados: int
    fallidos: int
    fallos: list[FalloEnvio]
    estado_envio: EstadoUltimoEnvio


class HistorialEnvioItem(BaseModel):
    """Una corrida pasada del envio de recordatorios, guardada en
    mercadeo_crm_historial_procesos (tipo 'correo_vencimiento_plan_liga')."""

    fecha: Optional[datetime] = None
    enviados: int
    fallidos: int
    total: int
    ejecutado_por: Optional[str] = None
    fallos: list[FalloEnvio]
