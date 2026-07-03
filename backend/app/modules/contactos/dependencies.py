from fastapi import Depends
from sqlalchemy.orm import Session

from app.modules.contactos.service import ContactoService
from app.shared.database.session import get_db


def get_contacto_service(db: Session = Depends(get_db)) -> ContactoService:
    return ContactoService(db)