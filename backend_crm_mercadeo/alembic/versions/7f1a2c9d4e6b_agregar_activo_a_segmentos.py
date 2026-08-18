"""agregar activo a segmentos

Revision ID: 7f1a2c9d4e6b
Revises: 639a56775c09
Create Date: 2026-08-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7f1a2c9d4e6b'
down_revision: Union[str, Sequence[str], None] = '639a56775c09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # "Eliminar" un segmento guardado desde el CRM es un soft delete (se oculta de la
    # vista, no se borra la fila): se necesita esta bandera para no tocar el registro.
    op.add_column(
        "mercadeo_crm_segmentos",
        sa.Column(
            "activo",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("mercadeo_crm_segmentos", "activo")
