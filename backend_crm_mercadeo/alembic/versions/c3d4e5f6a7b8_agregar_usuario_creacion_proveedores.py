"""agregar usuario_creacion_id a proveedores

Revision ID: c3d4e5f6a7b8
Revises: b2c3d4e5f6a7
Create Date: 2026-08-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b2c3d4e5f6a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _columna_existe(tabla: str, columna: str) -> bool:
    inspector = sa.inspect(op.get_bind())
    return any(c["name"].lower() == columna.lower() for c in inspector.get_columns(tabla))


def upgrade() -> None:
    """Upgrade schema."""
    # A diferencia de Contacto/Empresa (que ya tenian responsable_id desde el principio),
    # Proveedor nunca tuvo ninguna columna para "quien lo creo". Se agrega, aditiva y nullable
    # (por si ya existiera provisionada fuera de Alembic, igual que paso con las demas columnas
    # de auditoria en esta sesion, no se intenta agregar de nuevo).
    if not _columna_existe("mercadeo_crm_proveedores", "usuario_creacion_id"):
        op.add_column(
            "mercadeo_crm_proveedores",
            sa.Column(
                "usuario_creacion_id",
                sa.Integer(),
                sa.ForeignKey("intranet_usuarios.id"),
                nullable=True,
            ),
        )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("mercadeo_crm_proveedores", "usuario_creacion_id")
