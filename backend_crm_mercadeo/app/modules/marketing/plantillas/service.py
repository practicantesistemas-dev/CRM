import json

from app.models import PlantillaCorreo
from app.modules.marketing.plantillas.repository import PlantillasRepository
from app.modules.marketing.plantillas.schemas import PlantillaGuardar, PlantillaRead


class PlantillasService:
    def __init__(self, repository: PlantillasRepository) -> None:
        self.repository = repository

    def crear(self, datos: PlantillaGuardar, username: str) -> PlantillaRead:
        usuario_id = self.repository.obtener_usuario_id(username)
        plantilla = self.repository.crear(datos.model_dump(), usuario_id)
        return self._a_read(plantilla)

    def actualizar(
        self, id_plantilla: int, datos: PlantillaGuardar, username: str
    ) -> PlantillaRead | None:
        usuario_id = self.repository.obtener_usuario_id(username)
        plantilla = self.repository.actualizar(id_plantilla, datos.model_dump(), usuario_id)
        return None if plantilla is None else self._a_read(plantilla)

    @staticmethod
    def _a_read(plantilla: PlantillaCorreo) -> PlantillaRead:
        return PlantillaRead(
            id=plantilla.id,
            nombre=plantilla.nombre,
            asunto=plantilla.asunto,
            html=plantilla.html,
            css=plantilla.css,
            proyecto=None if plantilla.proyecto is None else json.loads(plantilla.proyecto),
            usuario_id=plantilla.usuario_id,
            usuario_actualizacion_id=plantilla.usuario_actualizacion_id,
            fecha_creacion=plantilla.fecha_creacion,
            fecha_actualizacion=plantilla.fecha_actualizacion,
        )
