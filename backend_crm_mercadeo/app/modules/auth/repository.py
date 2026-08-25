from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import PermisoApp, RolApp, RolPermisoApp, Usuario, UsuarioRolApp

# App duena de los permisos/roles en las tablas compartidas del Intranet
# (INTRANET_ROLES_APP.SISTEMA / INTRANET_PERMISOS_APP.SISTEMA). Todo lo que
# este backend otorga o consulta queda bajo este mismo valor.
SISTEMA_CRM = "CRM_MERCADEO"

# IDs de permisos "especiales" en INTRANET_PERMISOS_APP para CRM_MERCADEO
# (ver readme/CONSULTAS_EJEMPLO_PERMISOS_APP.md, secciones 4 y 5). No son
# modulos reales del CRM: un rol que tenga alguno de estos dos vinculado
# recibe la lista completa de permisos reales expandida en vez del permiso
# especial tal cual.
#   - 40 = ADMIN:  todos los permisos, EXCEPTO 39 y 40.
#   - 39 = JEFE:   todos los permisos, EXCEPTO configuracion (37, 38) y 39/40.
ID_PERMISO_ADMIN = 40
ID_PERMISO_JEFE = 39
IDS_EXCLUIR_ADMIN = (ID_PERMISO_JEFE, ID_PERMISO_ADMIN)
IDS_EXCLUIR_JEFE = (37, 38, ID_PERMISO_JEFE, ID_PERMISO_ADMIN)


class AuthRepository:
    def __init__(self, db: Session):
        self.db = db

    def obtener_por_usuario(self, username: str) -> Usuario | None:
        return (
            self.db.query(Usuario)
            .filter(func.upper(func.trim(Usuario.usuario)) == username.strip().upper())
            .first()
        )

    # NOMBRE del rol (INTRANET_ROLES_APP) que tiene el usuario en CRM_MERCADEO
    # (ej. "Admin", "Jefe", "Comercial"). None si no tiene ningun rol asignado
    # todavia. Si llegara a tener mas de uno, toma el primero.
    def obtener_rol_crm(self, usuario_id: int) -> str | None:
        return (
            self.db.query(RolApp.nombre)
            .join(UsuarioRolApp, UsuarioRolApp.rol_id == RolApp.id)
            .filter(
                UsuarioRolApp.usuario_id == usuario_id,
                UsuarioRolApp.sistema == SISTEMA_CRM,
                RolApp.sistema == SISTEMA_CRM,
            )
            .limit(1)
            .scalar()
        )

    # Permisos granulares del usuario para este sistema, como strings
    # "modulo:accion" (ej. "contactos:gestionar", "configuracion:ver").
    # Replica los 3 casos (ADMIN / JEFE / usuario normal) de la consulta 5
    # en readme/CONSULTAS_EJEMPLO_PERMISOS_APP.md - ver ese archivo para
    # probar la misma logica directo en SQL, y readme/DIAGRAMA_BASE_DATOS.md
    # para el modelo entidad-relacion completo.
    def obtener_permisos(self, usuario_id: int) -> list[str]:
        ids_permisos_usuario = {
            permiso_id
            for (permiso_id,) in self.db.query(RolPermisoApp.permiso_id)
            .join(RolApp, RolApp.id == RolPermisoApp.rol_id)
            .join(UsuarioRolApp, UsuarioRolApp.rol_id == RolApp.id)
            .filter(
                UsuarioRolApp.usuario_id == usuario_id,
                UsuarioRolApp.sistema == SISTEMA_CRM,
                RolApp.sistema == SISTEMA_CRM,
            )
            .distinct()
            .all()
        }
        # DEBUG TEMPORAL - quitar despues de encontrar por que permisos sale vacio
        import sys

        from app.core.config import settings

        print(
            f"[DEBUG obtener_permisos] usuario_id={usuario_id!r} "
            f"ids_permisos_usuario={ids_permisos_usuario!r} "
            f"db={settings.scse_db_ip}:{settings.scse_db_port}/{settings.scse_db_database}",
            file=sys.stderr,
            flush=True,
        )

        query = self.db.query(PermisoApp.modulo, PermisoApp.accion).filter(
            PermisoApp.sistema == SISTEMA_CRM
        )
        if ID_PERMISO_ADMIN in ids_permisos_usuario:
            query = query.filter(~PermisoApp.id.in_(IDS_EXCLUIR_ADMIN))
        elif ID_PERMISO_JEFE in ids_permisos_usuario:
            query = query.filter(~PermisoApp.id.in_(IDS_EXCLUIR_JEFE))
        else:
            query = query.filter(PermisoApp.id.in_(ids_permisos_usuario))

        return sorted(f"{modulo}:{accion}" for modulo, accion in query.all())
