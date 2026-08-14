from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import PlanLigaTipoPlan
from app.modules.servicios_proveedores.servicios.repository import ServicioRepository
from app.modules.servicios_proveedores.servicios.schemas import (
    ServicioCreate,
    ServicioListado,
    ServicioRead,
)


class ServicioService:
    def __init__(self, db: Session) -> None:
        self.repository = ServicioRepository(db)

    def list(
        self,
        q: str | None = None,
        categoria: str | None = None,
        tipo_cliente: str | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> ServicioListado:
        servicios = self.repository.buscar(
            q=q, categoria=categoria, tipo_cliente=tipo_cliente, estado=estado, skip=skip, limit=limit
        )
        total = self.repository.contar(q=q, categoria=categoria, tipo_cliente=tipo_cliente, estado=estado)
        return ServicioListado(
            items=[ServicioRead.model_validate(servicio) for servicio in servicios],
            total=total,
        )

    def crear(self, data: ServicioCreate) -> ServicioRead:
        plan = PlanLigaTipoPlan(**data.model_dump())
        plan = self.repository.crear(plan)
        return ServicioRead.model_validate(plan)

    def categorias(self) -> list[str]:
        return self.repository.categorias()

    def tipos_cliente(self) -> list[str]:
        return self.repository.tipos_cliente()
