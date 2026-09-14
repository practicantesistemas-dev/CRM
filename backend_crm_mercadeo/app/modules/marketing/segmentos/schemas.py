from pydantic import BaseModel


class TitularSegmentoItem(BaseModel):
    """Datos mas importantes de un titular de Plan Liga, para previsualizar
    un segmento antes de mandarle una campana."""

    ID_TITULAR: int
    TIPO_DOCUMENTO: str | None = None
    DOCUMENTO: str | None = None
    NOMBRE: str | None = None
    SEXO: str | None = None
    EDAD: int | None = None
    CIUDAD: str | None = None
    DEPARTAMENTO: str | None = None
    TIPO_PLAN: str | None = None
    EMPRESA: str | None = None
    VINCULACION: str
    CORREO: str | None = None
    TELEFONO: str | None = None
    ESTADO: str | None = None
    FECHA_INGRESO: str | None = None


class ListadoTitularesSegmento(BaseModel):
    total: int
    items: list[TitularSegmentoItem]
