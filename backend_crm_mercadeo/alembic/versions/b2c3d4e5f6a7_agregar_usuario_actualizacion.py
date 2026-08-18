"""agregar usuario_actualizacion_id (y fecha_actualizacion en bitacora)

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-08-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Tablas que ya tienen fecha_actualizacion pero no un usuario asociado a esa actualizacion.
TABLAS_CON_FECHA = [
    "mercadeo_crm_contactos",
    "mercadeo_crm_empresas",
    "mercadeo_crm_oportunidades",
    "mercadeo_crm_proveedores",
    "mercadeo_crm_actividad",
]


def _columna_existe(tabla: str, columna: str) -> bool:
    inspector = sa.inspect(op.get_bind())
    return any(c["name"].lower() == columna.lower() for c in inspector.get_columns(tabla))


def _agregar_si_falta(tabla: str, columna: str, tipo: sa.types.TypeEngine, fk: str | None = None) -> None:
    # En esta base, algunas tablas ya traian estas columnas provisionadas (fuera del control de
    # Alembic) antes de que el modelo de esta app las mapeara: si ya existe, no se toca nada.
    if _columna_existe(tabla, columna):
        return
    col = sa.Column(columna, tipo, sa.ForeignKey(fk), nullable=True) if fk else sa.Column(columna, tipo, nullable=True)
    op.add_column(tabla, col)


def upgrade() -> None:
    """Upgrade schema."""
    for tabla in TABLAS_CON_FECHA:
        _agregar_si_falta(tabla, "usuario_actualizacion_id", sa.Integer(), "intranet_usuarios.id")

    # Bitacora: no tenia ninguna columna de "ultima modificacion" en el modelo de esta app.
    _agregar_si_falta("mercadeo_crm_bitacora", "usuario_actualizacion_id", sa.Integer(), "intranet_usuarios.id")
    _agregar_si_falta("mercadeo_crm_bitacora", "fecha_actualizacion", sa.DateTime())


def downgrade() -> None:
    """Downgrade schema."""
    # No se revierte: estas columnas ya existian en la base antes de esta migracion en varias
    # tablas (ver upgrade), asi que un downgrade automatico podria borrar columnas que no fueron
    # creadas por esta migracion. Si hace falta revertir, hacerlo a mano revisando cada tabla.
    pass
