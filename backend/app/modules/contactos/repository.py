from sqlalchemy import Select, select

from app.modules.contactos.models import Contacto
from app.shared.database.base_repository import BaseRepository


class ContactoRepository(BaseRepository[Contacto]):
    model = Contacto

    def get_by_documento(self, documento: str) -> Contacto | None:
        return self.db.scalar(select(Contacto).where(Contacto.documento == documento))

    def query(self) -> Select:
        return select(Contacto)