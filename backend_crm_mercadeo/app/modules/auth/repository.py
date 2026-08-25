from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import PermisoApp, RolApp, RolPermisoApp, Usuario, UsuarioRolApp

# App duena de los permisos/roles en las tablas compartidas del Intranet
# (INTRANET_ROLES_APP.SISTEMA / INTRANET_PERMISOS_APP.SISTEMA). Todo lo que
# este backend otorga o consulta queda bajo este mismo valor.
SISTEMA_CRM = "CRM_MERCADEO"

# MODULO "comodin" en INTRANET_PERMISOS_APP (no son modulos reales del CRM,
# no deben devolverse tal cual): un rol que tenga alguno de estos dos
# permisos recibe la lista completa de permisos reales expandida en vez del
# comodin.
#   - "logica": todos los modulos reales, EXCEPTO configuracion.
#   - "todo":   todos los modulos reales, sin excepcion (para Admin).
MODULO_TODO = "todo"
MODULO_LOGICA = "logica"
MODULOS_COMODIN = {MODULO_TODO, MODULO_LOGICA}


class AuthRepository:
    def __init__(self, db: Session):
        self.db = db

    def obtener_por_usuario(self, username: str) -> Usuario | None:
        return (
            self.db.query(Usuario)
            .filter(func.upper(func.trim(Usuario.usuario)) == username.strip().upper())
            .first()
        )

    # Permisos granulares del usuario para este sistema, como strings
    # "modulo:accion" (ej. "contactos:gestionar", "configuracion:ver").
    # Ver DIAGRAMA_BASE_DATOS.md para el modelo entidad-relacion completo.
    def obtener_permisos(self, usuario_id: int) -> list[str]:
        filas = (
            self.db.query(PermisoApp.modulo, PermisoApp.accion)
            .join(RolPermisoApp, RolPermisoApp.permiso_id == PermisoApp.id)
            .join(RolApp, RolApp.id == RolPermisoApp.rol_id)
            .join(UsuarioRolApp, UsuarioRolApp.rol_id == RolApp.id)
            .filter(
                UsuarioRolApp.usuario_id == usuario_id,
                UsuarioRolApp.sistema == SISTEMA_CRM,
                RolApp.sistema == SISTEMA_CRM,
                PermisoApp.sistema == SISTEMA_CRM,
            )
            .distinct()
            .all()
        )

        comodines = {modulo for modulo, _ in filas if modulo in MODULOS_COMODIN}
        if comodines:
            return self._expandir_comodin(incluir_configuracion=MODULO_TODO in comodines)
        return sorted(f"{modulo}:{accion}" for modulo, accion in filas)

    # "todo" -> todos los modulos reales. "logica" -> todos menos configuracion.
    def _expandir_comodin(self, *, incluir_configuracion: bool) -> list[str]:
        query = self.db.query(PermisoApp.modulo, PermisoApp.accion).filter(
            PermisoApp.sistema == SISTEMA_CRM,
            ~PermisoApp.modulo.in_(MODULOS_COMODIN),
        )
        if not incluir_configuracion:
            query = query.filter(PermisoApp.modulo != "configuracion")
        return sorted(f"{modulo}:{accion}" for modulo, accion in query.all())
