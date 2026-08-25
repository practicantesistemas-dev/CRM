import hashlib
from datetime import timedelta

from app.core.config import settings
from app.core.security import create_access_token
from app.models import Usuario
from app.modules.auth.exceptions import CredencialesInvalidasError, UsuarioInactivoError
from app.modules.auth.repository import AuthRepository
from app.modules.auth.schemas import AuthResponse, LoginRequest, UserInfo

ESTADOS_ACTIVOS = {"1", "A", "S", "ACTIVO", "TRUE"}


def _esta_activo(estado: str | None) -> bool:
    return not estado or estado.strip().upper() in ESTADOS_ACTIVOS


def _contrasena_coincide(guardada: str | None, ingresada: str) -> bool:
    if not guardada:
        return False
    guardada = guardada.strip()
    ingresada = ingresada.strip()

    # Comparacion en texto plano (usuarios de prueba, ej. "admin"): comentada por ahora, en
    # produccion todos los usuarios reales del portal tienen la contrasena como hash SHA1.
    # if guardada.upper() == ingresada.upper():
    #     return True

    # Usuarios reales importados del portal: la contraseña esta guardada como hash SHA1
    # (case no consistente en los datos existentes, de ahi el .upper() en ambos lados).
    hash_ingresada = hashlib.sha1(ingresada.encode("utf-8")).hexdigest()
    return guardada.upper() == hash_ingresada.upper()


def _rol(usuario: Usuario) -> str:
    return (usuario.portal_rol or "").strip()


class AuthService:
    def __init__(self, repository: AuthRepository):
        self.repository = repository

    def login(self, data: LoginRequest) -> AuthResponse:
        usuario = self.repository.obtener_por_usuario(data.username)
        if usuario is None or not _contrasena_coincide(usuario.contrasena, data.password):
            raise CredencialesInvalidasError()
        if not _esta_activo(usuario.estado):
            raise UsuarioInactivoError()

        role_crm = self.repository.obtener_rol_crm(usuario.id)
        token = create_access_token(
            data={"sub": usuario.usuario, "role_crm": role_crm},
            expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
        )
        return AuthResponse(
            token=token,
            username=usuario.usuario or "",
            nombres=usuario.nombres or "",
            portal_role=_rol(usuario),
            id_area=usuario.id_area,
            permisos=self.repository.obtener_permisos(usuario.id),
            role_crm=role_crm,
        )

    def obtener_usuario_actual(self, username: str) -> UserInfo:
        usuario = self.repository.obtener_por_usuario(username)
        if usuario is None or not _esta_activo(usuario.estado):
            raise UsuarioInactivoError()
        return UserInfo(
            username=usuario.usuario or "",
            nombres=usuario.nombres or "",
            portal_role=_rol(usuario),
            id_area=usuario.id_area,
            permisos=self.repository.obtener_permisos(usuario.id),
            role_crm=self.repository.obtener_rol_crm(usuario.id),
        )
