from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import RolApp, Usuario, UsuarioRolApp
from app.modules.auth.repository import SISTEMA_CRM

# Roles que no se asignan desde esta pantalla: se administran aparte, por SQL
# directo (ver readme/CONSULTAS_EJEMPLO_PERMISOS_APP.md), porque dan acceso
# total o casi total al CRM.
NOMBRES_ROLES_RESTRINGIDOS = {"ADMIN", "JEFE"}


class UsuariosRolesRepository:
    def __init__(self, db: Session):
        self.db = db

    def buscar_usuarios(self, nombre: str, limit: int = 20) -> list[Usuario]:
        patron = f"%{nombre.strip().upper()}%"
        return (
            self.db.query(Usuario)
            .filter(func.upper(Usuario.nombres).like(patron))
            .order_by(Usuario.nombres)
            .limit(limit)
            .all()
        )

    def obtener_usuario(self, usuario_id: int) -> Usuario | None:
        return self.db.query(Usuario).filter(Usuario.id == usuario_id).first()

    # Todos los usuarios que ya tienen algun rol asignado en CRM_MERCADEO,
    # junto con ese rol (id, nombre).
    def listar_usuarios_con_rol(self, limit: int = 200) -> list[tuple[Usuario, int, str]]:
        return (
            self.db.query(Usuario, RolApp.id, RolApp.nombre)
            .join(UsuarioRolApp, UsuarioRolApp.usuario_id == Usuario.id)
            .join(RolApp, RolApp.id == UsuarioRolApp.rol_id)
            .filter(UsuarioRolApp.sistema == SISTEMA_CRM, RolApp.sistema == SISTEMA_CRM)
            .order_by(Usuario.nombres)
            .limit(limit)
            .all()
        )

    # Rol que el usuario ya tiene en CRM_MERCADEO (id, nombre) o None.
    def rol_actual(self, usuario_id: int) -> tuple[int, str] | None:
        return (
            self.db.query(RolApp.id, RolApp.nombre)
            .join(UsuarioRolApp, UsuarioRolApp.rol_id == RolApp.id)
            .filter(
                UsuarioRolApp.usuario_id == usuario_id,
                UsuarioRolApp.sistema == SISTEMA_CRM,
                RolApp.sistema == SISTEMA_CRM,
            )
            .first()
        )

    def listar_roles_asignables(self) -> list[RolApp]:
        return (
            self.db.query(RolApp)
            .filter(
                RolApp.sistema == SISTEMA_CRM,
                ~func.upper(RolApp.nombre).in_(NOMBRES_ROLES_RESTRINGIDOS),
            )
            .order_by(RolApp.nombre)
            .all()
        )

    def rol_es_asignable(self, rol_id: int) -> bool:
        rol = (
            self.db.query(RolApp)
            .filter(RolApp.id == rol_id, RolApp.sistema == SISTEMA_CRM)
            .first()
        )
        return rol is not None and rol.nombre.strip().upper() not in NOMBRES_ROLES_RESTRINGIDOS

    # Reemplaza el rol que el usuario tiene en CRM_MERCADEO (un usuario tiene
    # como maximo un rol por sistema desde esta pantalla). fecha_actualizado
    # se pone a mano (sin default en el modelo) porque de ahi lee
    # get_current_username para invalidar tokens viejos tras el cambio.
    def asignar_rol(self, usuario_id: int, rol_id: int) -> None:
        ahora = datetime.now(timezone.utc)
        self.db.query(UsuarioRolApp).filter(
            UsuarioRolApp.usuario_id == usuario_id,
            UsuarioRolApp.sistema == SISTEMA_CRM,
        ).delete()
        self.db.add(
            UsuarioRolApp(
                usuario_id=usuario_id,
                rol_id=rol_id,
                sistema=SISTEMA_CRM,
                fecha_creado=ahora,
                fecha_actualizado=ahora,
            )
        )
        self.db.commit()

    # Quita el rol de CRM_MERCADEO que tenga el usuario (borra la fila de
    # INTRANET_USUARIO_ROL_APP). Sin fila, fecha_ultimo_cambio_rol devuelve
    # None y get_current_username bloquea su proximo request como "sin rol"
    # (app/core/dependencies.py) - no hace falta ningun watermark aqui.
    def eliminar_rol(self, usuario_id: int) -> None:
        self.db.query(UsuarioRolApp).filter(
            UsuarioRolApp.usuario_id == usuario_id,
            UsuarioRolApp.sistema == SISTEMA_CRM,
        ).delete()
        self.db.commit()
