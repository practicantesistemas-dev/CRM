import json

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import PlantillaCorreo, Usuario


class PlantillasRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def obtener_usuario_id(self, username: str) -> int | None:
        stmt = select(Usuario.id).where(
            func.upper(func.trim(Usuario.usuario)) == username.strip().upper()
        )
        return self.db.scalar(stmt)

    def crear(self, datos: dict, usuario_id: int | None) -> PlantillaCorreo:
        plantilla = PlantillaCorreo(
            nombre=datos["nombre"],
            asunto=datos.get("asunto"),
            html=datos.get("html"),
            css=datos.get("css"),
            proyecto=self._serializar_proyecto(datos.get("proyecto")),
            usuario_id=usuario_id,
            usuario_actualizacion_id=usuario_id,
        )
        self.db.add(plantilla)
        self.db.commit()
        self.db.refresh(plantilla)
        return plantilla

    def actualizar(
        self, id_plantilla: int, datos: dict, usuario_id: int | None
    ) -> PlantillaCorreo | None:
        plantilla = self.db.get(PlantillaCorreo, id_plantilla)
        if plantilla is None:
            return None

        plantilla.nombre = datos["nombre"]
        plantilla.asunto = datos.get("asunto")
        plantilla.html = datos.get("html")
        plantilla.css = datos.get("css")
        plantilla.proyecto = self._serializar_proyecto(datos.get("proyecto"))
        plantilla.usuario_actualizacion_id = usuario_id

        self.db.commit()
        self.db.refresh(plantilla)
        return plantilla

    @staticmethod
    def _serializar_proyecto(proyecto) -> str | None:
        """`proyecto` llega como el objeto JSON del editor (GrapesJS
        projectData); la columna es texto, asi que se guarda serializado."""
        return None if proyecto is None else json.dumps(proyecto)
