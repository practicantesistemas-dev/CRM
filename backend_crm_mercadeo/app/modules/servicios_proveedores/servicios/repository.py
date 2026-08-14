from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement

from app.models import PlanLigaTipoPlan


class ServicioRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def _filtros(
        self,
        q: str | None,
        categoria: str | None,
        tipo_cliente: str | None,
        estado: str | None,
    ) -> list[ColumnElement]:
        condiciones = []
        if estado is not None:
            condiciones.append(PlanLigaTipoPlan.estado == estado)
        if categoria:
            condiciones.append(func.upper(PlanLigaTipoPlan.categoria) == categoria.upper())
        if tipo_cliente:
            condiciones.append(func.upper(PlanLigaTipoPlan.tipo_cliente) == tipo_cliente.upper())
        if q:
            patron = f"%{q.strip().upper()}%"
            condiciones.append(func.upper(PlanLigaTipoPlan.nombre).like(patron))
        return condiciones

    def buscar(
        self,
        q: str | None = None,
        categoria: str | None = None,
        tipo_cliente: str | None = None,
        estado: str | None = None,
        skip: int = 0,
        limit: int = 100,
    ) -> list[PlanLigaTipoPlan]:
        condiciones = self._filtros(q, categoria, tipo_cliente, estado)
        stmt = (
            select(PlanLigaTipoPlan)
            .where(*condiciones)
            .order_by(PlanLigaTipoPlan.nombre)
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(stmt))

    def contar(
        self,
        q: str | None = None,
        categoria: str | None = None,
        tipo_cliente: str | None = None,
        estado: str | None = None,
    ) -> int:
        condiciones = self._filtros(q, categoria, tipo_cliente, estado)
        stmt = select(func.count()).select_from(PlanLigaTipoPlan).where(*condiciones)
        return self.db.scalar(stmt) or 0

    def crear(self, plan: PlanLigaTipoPlan) -> PlanLigaTipoPlan:
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def categorias(self) -> list[str]:
        stmt = (
            select(PlanLigaTipoPlan.categoria)
            .where(PlanLigaTipoPlan.categoria.is_not(None))
            .distinct()
            .order_by(PlanLigaTipoPlan.categoria)
        )
        return [categoria for categoria in self.db.scalars(stmt) if categoria]

    # "categoria" en intranet_planliga_tipo_plan solo tiene el valor "planliga" en todas las
    # filas: no sirve para agrupar/filtrar. "tipo_cliente" (Particular/Empresarial) es el
    # campo que realmente distingue los servicios, así que es lo que usa el filtro del CRM.
    def tipos_cliente(self) -> list[str]:
        stmt = (
            select(PlanLigaTipoPlan.tipo_cliente)
            .where(PlanLigaTipoPlan.tipo_cliente.is_not(None))
            .distinct()
            .order_by(PlanLigaTipoPlan.tipo_cliente)
        )
        return [tipo for tipo in self.db.scalars(stmt) if tipo]
