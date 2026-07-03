from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.shared.database.base import Base


class Contacto(Base):
    __tablename__ = "contactos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    documento: Mapped[str | None] = mapped_column(String(30), unique=True)
    correo: Mapped[str | None] = mapped_column(String(150))
    telefono: Mapped[str | None] = mapped_column(String(30))
    cargo: Mapped[str | None] = mapped_column(String(100))
    ciudad: Mapped[str | None] = mapped_column(String(100))
    fecha_nacimiento: Mapped[date | None] = mapped_column(Date)
    estado: Mapped[str] = mapped_column(String(20), default="activo")
    empresa_id: Mapped[int | None] = mapped_column(ForeignKey("empresas.id"))
    responsable_id: Mapped[int | None] = mapped_column(ForeignKey("usuarios.id"))