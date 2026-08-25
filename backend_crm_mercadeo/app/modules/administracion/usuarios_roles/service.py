from app.modules.administracion.usuarios_roles.exceptions import (
    RolNoAsignableError,
    UsuarioNotFoundError,
)
from app.modules.administracion.usuarios_roles.repository import UsuariosRolesRepository
from app.modules.administracion.usuarios_roles.schemas import (
    AsignarRolRequest,
    RolAsignableRead,
    UsuarioBusquedaRead,
)


class UsuariosRolesService:
    def __init__(self, repository: UsuariosRolesRepository):
        self.repository = repository

    def buscar_usuarios(self, nombre: str) -> list[UsuarioBusquedaRead]:
        resultado = []
        for usuario in self.repository.buscar_usuarios(nombre):
            rol = self.repository.rol_actual(usuario.id)
            resultado.append(
                UsuarioBusquedaRead(
                    id=usuario.id,
                    usuario=usuario.usuario or "",
                    nombres=usuario.nombres or "",
                    estado=usuario.estado,
                    role_crm_id=rol[0] if rol else None,
                    role_crm=rol[1] if rol else None,
                )
            )
        return resultado

    def listar_usuarios_con_rol(self) -> list[UsuarioBusquedaRead]:
        return [
            UsuarioBusquedaRead(
                id=usuario.id,
                usuario=usuario.usuario or "",
                nombres=usuario.nombres or "",
                estado=usuario.estado,
                role_crm_id=rol_id,
                role_crm=rol_nombre,
            )
            for usuario, rol_id, rol_nombre in self.repository.listar_usuarios_con_rol()
        ]

    def listar_roles_asignables(self) -> list[RolAsignableRead]:
        return [
            RolAsignableRead(id=rol.id, nombre=rol.nombre)
            for rol in self.repository.listar_roles_asignables()
        ]

    def asignar_rol(self, usuario_id: int, data: AsignarRolRequest) -> None:
        if self.repository.obtener_usuario(usuario_id) is None:
            raise UsuarioNotFoundError(usuario_id)
        if not self.repository.rol_es_asignable(data.rol_id):
            raise RolNoAsignableError(data.rol_id)
        self.repository.asignar_rol(usuario_id, data.rol_id)

    def eliminar_rol(self, usuario_id: int) -> None:
        if self.repository.obtener_usuario(usuario_id) is None:
            raise UsuarioNotFoundError(usuario_id)
        self.repository.eliminar_rol(usuario_id)
