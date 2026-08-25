from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class AuthResponse(BaseModel):
    token: str
    username: str
    nombres: str = ""
    portal_role: str = "usuario"
    id_area: int | None = None
    area_name: str = ""
    email: str = ""
    # Permisos granulares del CRM como "modulo:accion" (ej. "contactos:ver").
    # Ver AuthRepository.obtener_permisos para de donde salen.
    permisos: list[str] = []
    # NOMBRE del rol en INTRANET_ROLES_APP para CRM_MERCADEO (ej. "Admin").
    # Tambien viaja dentro del token (claim "role_crm"); se repite aqui
    # como campo plano para no tener que decodificar el JWT para leerlo.
    role_crm: str | None = None


class UserInfo(BaseModel):
    username: str
    nombres: str = ""
    portal_role: str = "usuario"
    id_area: int | None = None
    area_name: str = ""
    email: str = ""
    permisos: list[str] = []
    role_crm: str | None = None
