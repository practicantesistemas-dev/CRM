from datetime import datetime

from pydantic import BaseModel


class ImportacionCreate(BaseModel):
    tipo: str
    archivo: str
    registros: int
    errores: int
    detalle_errores: list[str] = []
    avisos: list[str] = []


class ImportacionRead(BaseModel):
    id: int
    tipo: str | None = None
    archivo: str | None = None
    registros: int | None = None
    errores: int | None = None
    detalle_errores: list[str] = []
    avisos: list[str] = []
    fecha: datetime | None = None
    usuario: str | None = None
