from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from app.modules.marketing.etiquetas.schemas import EtiquetaRead
from app.shared.enums import EstadoContacto, TipoContacto


class ContactoEmpresaResumen(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    razon_social: str
    # Nulo en empresas importadas desde Plan Liga sin NIT asociado (ver comentario en
    # Empresa.nit, app/models.py): antes exigía str y tumbaba con 500 cualquier POST/GET de
    # un contacto ligado a una de esas empresas.
    nit: str | None = None
    ciudad: str | None = None


class ContactoResponsableResumen(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombres: str | None = None
    usuario: str | None = None


class ContactoBase(BaseModel):
    tipo_contacto: TipoContacto | None = None
    tipo_documento: str | None = None
    documento: str | None = None
    nombre1: str
    nombre2: str | None = None
    apellido1: str | None = None
    apellido2: str | None = None
    sexo: str | None = None
    correo: str | None = None
    telefono: str | None = None
    cargo: str | None = None
    municipio: str | None = None
    departamento: str | None = None
    fecha_nacimiento: date | None = None
    empresa_id: int | None = None


class ContactoCreate(ContactoBase):
    estado: EstadoContacto | None = None
    etiqueta_ids: list[int] = []


class ContactoUpdate(BaseModel):
    tipo_contacto: TipoContacto | None = None
    tipo_documento: str | None = None
    documento: str | None = None
    nombre1: str | None = None
    nombre2: str | None = None
    apellido1: str | None = None
    apellido2: str | None = None
    sexo: str | None = None
    correo: str | None = None
    telefono: str | None = None
    cargo: str | None = None
    municipio: str | None = None
    departamento: str | None = None
    fecha_nacimiento: date | None = None
    estado: EstadoContacto | None = None
    empresa_id: int | None = None
    etiqueta_ids: list[int] | None = None


class ContactoRead(ContactoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    # Suelto (no EstadoContacto): registros viejos pueden traer "Prospecto"/"En proceso"
    # guardados en ESTADO por un uso histórico incorrecto y deben poder leerse tal cual.
    estado: str | None = None
    responsable_id: int | None = None
    fecha_creacion: datetime | None = None
    fecha_actualizacion: datetime | None = None
    etiquetas: list[EtiquetaRead] = []
    empresa: ContactoEmpresaResumen | None = None
    responsable: ContactoResponsableResumen | None = None
