"""agregar detalle_errores y avisos a importaciones

Revision ID: a1b2c3d4e5f6
Revises: 7f1a2c9d4e6b
Create Date: 2026-08-18 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '7f1a2c9d4e6b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Detalle fila por fila de una importación (mensajes de error y avisos), guardado como JSON
    # en texto para que el reporte descargable siga disponible aunque se cargue el historial en
    # una sesión distinta a la que hizo la importación (antes solo se guardaban los contadores).
    op.add_column(
        "mercadeo_crm_importaciones",
        sa.Column("detalle_errores", sa.Text(), nullable=True),
    )
    op.add_column(
        "mercadeo_crm_importaciones",
        sa.Column("avisos", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("mercadeo_crm_importaciones", "avisos")
    op.drop_column("mercadeo_crm_importaciones", "detalle_errores")
