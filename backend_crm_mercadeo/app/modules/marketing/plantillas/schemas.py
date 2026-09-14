from datetime import datetime
from typing import Any

from pydantic import BaseModel


class PlantillaGuardar(BaseModel):
    """Lo que manda el editor visual al guardar (EditorPlantillaDialog.armarDraft()
    en el frontend): mismo shape que PlantillaDraft."""

    nombre: str
    asunto: str | None = None
    html: str | None = None
    css: str | None = None
    # projectData de GrapesJS (JSON). Se guarda como texto en la BD.
    proyecto: Any | None = None


class PlantillaRead(BaseModel):
    id: int
    nombre: str
    asunto: str | None = None
    html: str | None = None
    css: str | None = None
    proyecto: Any | None = None
    usuario_id: int | None = None
    usuario_actualizacion_id: int | None = None
    fecha_creacion: datetime | None = None
    fecha_actualizacion: datetime | None = None
