from app.core.exceptions import ForbiddenError, NotFoundError


class UsuarioNotFoundError(NotFoundError):
    def __init__(self, usuario_id: int) -> None:
        super().__init__(detail=f"Usuario {usuario_id} no encontrado")


class RolNoAsignableError(ForbiddenError):
    def __init__(self, rol_id: int) -> None:
        super().__init__(
            detail=f"El rol {rol_id} no se puede asignar desde aqui (Admin/Jefe se asignan aparte)"
        )
