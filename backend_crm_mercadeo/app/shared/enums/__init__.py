from enum import Enum


class EstadoBitacora(str, Enum):
    PENDIENTE = "pendiente"
    REALIZADO = "realizado"


class TipoActividadBitacora(str, Enum):
    LLAMADA = "llamada"
    CORREO = "correo"
    REUNION = "reunion"
    WHATSAPP = "whatsapp"
    MENSAJE = "mensaje"
    NOTA = "nota"


class TipoContacto(str, Enum):
    CLIENTE = "Cliente"
    PROSPECTO = "Prospecto"


# El ciclo de vida del contacto (activo/inactivo) es independiente de TipoContacto
# (Cliente/Prospecto, qué es el contacto para el negocio). La columna ESTADO en Oracle es
# VARCHAR2 libre y algunos registros viejos aún guardan "Prospecto"/"En proceso" ahí por un
# uso histórico incorrecto; ContactoRead sigue leyendo esos valores tal cual (str suelto),
# este enum solo restringe lo que se puede ESCRIBIR de ahora en adelante vía la API.
class EstadoContacto(str, Enum):
    ACTIVO = "Activo"
    INACTIVO = "Inactivo"


class EtapaEmbudoNombre(str, Enum):
    LEAD = "Lead"
    PRIMER_CONTACTO = "Primer Contacto"
    REUNION = "Reunión"
    COTIZACION = "Cotización"
    NEGOCIACION = "Negociación"
    GANADA = "Ganada"
    PERDIDA = "Perdida"
