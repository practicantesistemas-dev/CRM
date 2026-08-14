from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServicioRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    categoria: str | None = None
    tipo_cliente: str | None = None
    beneficiarios: int
    beneficiarios_adicionales: int | None = None
    descripcion: str | None = None
    estado: str | None = None
    fecha_registro: datetime | None = None


class ServicioListado(BaseModel):
    items: list[ServicioRead]
    total: int


class ServicioCreate(BaseModel):
    nombre: str
    categoria: str
    tipo_cliente: str | None = None
    beneficiarios: int
    beneficiarios_adicionales: int | None = None
    descripcion: str | None = None
    estado: str = "A"
