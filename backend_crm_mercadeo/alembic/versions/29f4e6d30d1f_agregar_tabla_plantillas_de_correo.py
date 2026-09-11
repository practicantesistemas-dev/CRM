"""agregar tabla plantillas de correo

Revision ID: 29f4e6d30d1f
Revises: e1a2b3c4d5e6
Create Date: 2026-09-11 12:53:55.734252

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '29f4e6d30d1f'
down_revision: Union[str, Sequence[str], None] = 'e1a2b3c4d5e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "mercadeo_crm_plantillas_correo",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("nombre", sa.String(length=150), nullable=False),
        sa.Column("asunto", sa.String(length=200), nullable=True),
        sa.Column("html", sa.Text(), nullable=True),
        sa.Column("css", sa.Text(), nullable=True),
        # JSON del editor visual (GrapesJS), como texto, para poder reabrir la
        # plantilla sin perder estilos (ver PlantillaDraft.proyecto en el frontend).
        sa.Column("proyecto", sa.Text(), nullable=True),
        sa.Column("usuario_id", sa.Integer(), nullable=True),
        sa.Column("usuario_actualizacion_id", sa.Integer(), nullable=True),
        sa.Column("fecha_creacion", sa.DateTime(), nullable=True),
        sa.Column("fecha_actualizacion", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["usuario_id"], ["intranet_usuarios.id"]),
        sa.ForeignKeyConstraint(["usuario_actualizacion_id"], ["intranet_usuarios.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    # Autonumeracion de "id" (secuencia + trigger BEFORE INSERT): mismo patron
    # que el resto de tablas mercadeo_crm_* (ver
    # 4e379ceb9f70_agregar_identity_a_ids_crm_mercadeo.py). Sin esto, un INSERT
    # sin "id" explicito fallaria (la columna es NOT NULL via PK).
    conn = op.get_bind()
    conn.exec_driver_sql(
        "CREATE SEQUENCE seq_plantillas_correo START WITH 1 INCREMENT BY 1 NOCACHE"
    )
    conn.exec_driver_sql(
        """
        CREATE OR REPLACE TRIGGER trg_plantillas_correo_bi
        BEFORE INSERT ON mercadeo_crm_plantillas_correo
        FOR EACH ROW
        WHEN (NEW.id IS NULL)
        BEGIN
            SELECT seq_plantillas_correo.NEXTVAL INTO :NEW.id FROM dual;
        END;
        """
    )


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    conn.exec_driver_sql(
        """
        BEGIN
            EXECUTE IMMEDIATE 'DROP TRIGGER trg_plantillas_correo_bi';
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLCODE != -4080 THEN RAISE; END IF;
        END;
        """
    )
    conn.exec_driver_sql(
        """
        BEGIN
            EXECUTE IMMEDIATE 'DROP SEQUENCE seq_plantillas_correo';
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLCODE != -2289 THEN RAISE; END IF;
        END;
        """
    )
    op.drop_table("mercadeo_crm_plantillas_correo")
