"""renombrar mercadeo_crm_importaciones a mercadeo_crm_historial_procesos

Revision ID: e1a2b3c4d5e6
Revises: c3d4e5f6a7b8
Create Date: 2026-09-01 00:00:00.000000

No crea tabla nueva: reutiliza la de importaciones (misma forma - tipo,
registros, errores, detalle_errores, fecha, usuario_id) como historial
generico de procesos por lote, para no crear una tabla nueva cada vez que
otro flujo (ej. correos/vencimiento) necesita guardar "cuando corri esto y
con que resultado". El nombre fisico cambia; la clase Importacion y el
modulo de importaciones siguen igual (ver app/models.py).

La secuencia/trigger de autonumeracion (seq_importaciones / trg_importaciones_bi,
creados en 4e379ceb9f70) y la FK fk_importacion_usuario_id quedan con su
nombre viejo pero siguen funcionando: en Oracle, renombrar una tabla no
desvincula sus triggers ni constraints, solo cambia el nombre de la tabla.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e1a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "c3d4e5f6a7b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLA_VIEJA = "mercadeo_crm_importaciones"
TABLA_NUEVA = "mercadeo_crm_historial_procesos"


def upgrade() -> None:
    """Upgrade schema."""
    inspector = sa.inspect(op.get_bind())
    if inspector.has_table(TABLA_VIEJA) and not inspector.has_table(TABLA_NUEVA):
        op.rename_table(TABLA_VIEJA, TABLA_NUEVA)


def downgrade() -> None:
    """Downgrade schema."""
    inspector = sa.inspect(op.get_bind())
    if inspector.has_table(TABLA_NUEVA) and not inspector.has_table(TABLA_VIEJA):
        op.rename_table(TABLA_NUEVA, TABLA_VIEJA)
