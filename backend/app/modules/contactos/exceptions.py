from app.shared.exceptions.base import ConflictException, NotFoundException


class ContactoNotFound(NotFoundException):
    def __init__(self, contacto_id: int):
        super().__init__(detail=f"Contacto {contacto_id} no encontrado")


class DocumentoDuplicado(ConflictException):
    def __init__(self, documento: str):
        super().__init__(detail=f"Ya existe un contacto con el documento {documento}")