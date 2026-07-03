from enum import Enum


class EstadoRegistro(str, Enum):
    ACTIVO = "activo"
    INACTIVO = "inactivo"