from pydantic import BaseModel


class UsuarioBusquedaRead(BaseModel):
    id: int
    usuario: str
    nombres: str
    estado: str | None = None
    # Rol que ya tiene asignado en CRM_MERCADEO (None si todavia no tiene).
    role_crm_id: int | None = None
    role_crm: str | None = None


class RolAsignableRead(BaseModel):
    id: int
    nombre: str


class AsignarRolRequest(BaseModel):
    rol_id: int
