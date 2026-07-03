from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr


class ContactoBase(BaseModel):
    nombre: str
    documento: str | None = None
    correo: EmailStr | None = None
    telefono: str | None = None
    cargo: str | None = None
    ciudad: str | None = None
    fecha_nacimiento: date | None = None
    empresa_id: int | None = None
    responsable_id: int | None = None


class ContactoCreate(ContactoBase):
    pass


class ContactoUpdate(BaseModel):
    nombre: str | None = None
    documento: str | None = None
    correo: EmailStr | None = None
    telefono: str | None = None
    cargo: str | None = None
    ciudad: str | None = None
    fecha_nacimiento: date | None = None
    estado: str | None = None
    empresa_id: int | None = None
    responsable_id: int | None = None


class ContactoResponse(ContactoBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    estado: str