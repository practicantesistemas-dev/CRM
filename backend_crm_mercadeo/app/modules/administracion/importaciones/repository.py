import json
from datetime import datetime, timezone

from sqlalchemy import func, select

from app.models import Importacion, Usuario
from app.shared.database.base_repository import BaseRepository


class ImportacionRepository(BaseRepository[Importacion]):
    model = Importacion

    def obtener_usuario_id(self, username: str) -> int | None:
        stmt = select(Usuario.id).where(
            func.upper(func.trim(Usuario.usuario)) == username.strip().upper()
        )
        return self.db.scalar(stmt)

    def crear(
        self, tipo: str, archivo: str, registros: int, errores: int,
        detalle_errores: list[str], avisos: list[str], usuario_id: int | None,
    ) -> Importacion:
        importacion = Importacion(
            tipo=tipo,
            archivo=archivo,
            registros=registros,
            errores=errores,
            detalle_errores=json.dumps(detalle_errores, ensure_ascii=False),
            avisos=json.dumps(avisos, ensure_ascii=False),
            usuario_id=usuario_id,
            fecha=datetime.now(timezone.utc),
        )
        return self.create(importacion)

    # Registro de auditoria (quien importo que, y con que resultado): se listan todas las de
    # todos los usuarios, no solo las del usuario que consulta.
    #
    # mercadeo_crm_historial_procesos es una tabla compartida: ademas de las
    # importaciones guarda otros procesos por lote (ej. envio de correos de
    # vencimiento del Plan Liga, tipo 'correo_vencimiento_plan_liga'). Esos NO
    # son importaciones y no tienen archivo -> se filtran por archivo NOT NULL.
    def listar_recientes(self, limit: int = 50) -> list[Importacion]:
        stmt = (
            select(Importacion)
            .where(Importacion.archivo.isnot(None))
            .order_by(Importacion.fecha.desc())
            .limit(limit)
        )
        return list(self.db.scalars(stmt))
