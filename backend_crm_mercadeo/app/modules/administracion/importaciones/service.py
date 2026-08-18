import json

from sqlalchemy.orm import Session

from app.models import Importacion
from app.modules.administracion.importaciones.repository import ImportacionRepository
from app.modules.administracion.importaciones.schemas import ImportacionCreate, ImportacionRead


def _decodificar_lista(texto: str | None) -> list[str]:
    if not texto:
        return []
    try:
        valores = json.loads(texto)
    except (TypeError, ValueError):
        return []
    return valores if isinstance(valores, list) else []


def _to_read(importacion: Importacion) -> ImportacionRead:
    return ImportacionRead(
        id=importacion.id,
        tipo=importacion.tipo,
        archivo=importacion.archivo,
        registros=importacion.registros,
        errores=importacion.errores,
        detalle_errores=_decodificar_lista(importacion.detalle_errores),
        avisos=_decodificar_lista(importacion.avisos),
        fecha=importacion.fecha,
        usuario=importacion.usuario.nombres if importacion.usuario is not None else None,
    )


class ImportacionService:
    def __init__(self, db: Session) -> None:
        self.repo = ImportacionRepository(db)

    def crear(self, data: ImportacionCreate, username: str) -> ImportacionRead:
        usuario_id = self.repo.obtener_usuario_id(username)
        importacion = self.repo.crear(
            tipo=data.tipo, archivo=data.archivo, registros=data.registros, errores=data.errores,
            detalle_errores=data.detalle_errores, avisos=data.avisos, usuario_id=usuario_id,
        )
        return _to_read(importacion)

    def listar(self, limit: int = 50) -> list[ImportacionRead]:
        return [_to_read(i) for i in self.repo.listar_recientes(limit)]
