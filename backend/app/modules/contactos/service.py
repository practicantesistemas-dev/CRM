from sqlalchemy import Select
from sqlalchemy.orm import Session

from app.modules.contactos.exceptions import ContactoNotFound, DocumentoDuplicado
from app.modules.contactos.models import Contacto
from app.modules.contactos.repository import ContactoRepository
from app.modules.contactos.schemas import ContactoCreate, ContactoUpdate


class ContactoService:
    def __init__(self, db: Session):
        self.db = db
        self.repository = ContactoRepository(db)

    def create(self, data: ContactoCreate) -> Contacto:
        if data.documento and self.repository.get_by_documento(data.documento):
            raise DocumentoDuplicado(data.documento)
        contacto = Contacto(**data.model_dump())
        return self.repository.create(contacto)

    def get(self, contacto_id: int) -> Contacto:
        contacto = self.repository.get(contacto_id)
        if not contacto:
            raise ContactoNotFound(contacto_id)
        return contacto

    def update(self, contacto_id: int, data: ContactoUpdate) -> Contacto:
        contacto = self.get(contacto_id)
        if data.documento and data.documento != contacto.documento:
            if self.repository.get_by_documento(data.documento):
                raise DocumentoDuplicado(data.documento)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(contacto, field, value)
        return self.repository.update(contacto)

    def delete(self, contacto_id: int) -> None:
        contacto = self.get(contacto_id)
        contacto.estado = "inactivo"
        self.repository.update(contacto)

    def list_query(self) -> Select:
        return self.repository.query()