from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_username
from app.modules.administracion.usuarios_roles.dependencies import get_usuarios_roles_service
from app.modules.administracion.usuarios_roles.schemas import (
    AsignarRolRequest,
    RolAsignableRead,
    UsuarioBusquedaRead,
)
from app.modules.administracion.usuarios_roles.service import UsuariosRolesService

router = APIRouter(
    prefix="/usuarios-roles",
    tags=["Usuarios y roles (CRM)"],
    dependencies=[Depends(get_current_username)],
)


@router.get("/buscar", response_model=list[UsuarioBusquedaRead])
def buscar_usuarios(
    nombre: str = Query(..., min_length=2),
    service: UsuariosRolesService = Depends(get_usuarios_roles_service),
) -> list[UsuarioBusquedaRead]:
    return service.buscar_usuarios(nombre)


@router.get("/con-rol", response_model=list[UsuarioBusquedaRead])
def listar_usuarios_con_rol(
    service: UsuariosRolesService = Depends(get_usuarios_roles_service),
) -> list[UsuarioBusquedaRead]:
    return service.listar_usuarios_con_rol()


@router.get("/roles-asignables", response_model=list[RolAsignableRead])
def listar_roles_asignables(
    service: UsuariosRolesService = Depends(get_usuarios_roles_service),
) -> list[RolAsignableRead]:
    return service.listar_roles_asignables()


@router.put("/{usuario_id}/rol", status_code=status.HTTP_204_NO_CONTENT)
def asignar_rol(
    usuario_id: int,
    data: AsignarRolRequest,
    service: UsuariosRolesService = Depends(get_usuarios_roles_service),
) -> None:
    service.asignar_rol(usuario_id, data)


@router.delete("/{usuario_id}/rol", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_rol(
    usuario_id: int,
    service: UsuariosRolesService = Depends(get_usuarios_roles_service),
) -> None:
    service.eliminar_rol(usuario_id)
