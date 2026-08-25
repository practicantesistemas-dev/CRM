from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.modules.administracion.usuarios_roles.repository import UsuariosRolesRepository
from app.modules.administracion.usuarios_roles.service import UsuariosRolesService


def get_usuarios_roles_service(db: Session = Depends(get_db)) -> UsuariosRolesService:
    return UsuariosRolesService(UsuariosRolesRepository(db))
