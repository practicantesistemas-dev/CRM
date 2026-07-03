from fastapi import APIRouter, Depends, status

from app.modules.contactos.dependencies import get_contacto_service
from app.modules.contactos.schemas import ContactoCreate, ContactoResponse, ContactoUpdate
from app.modules.contactos.service import ContactoService
from app.shared.pagination import Page, paginate

router = APIRouter(prefix="/contactos", tags=["Contactos"])


@router.post("/", response_model=ContactoResponse, status_code=status.HTTP_201_CREATED)
def crear_contacto(
    data: ContactoCreate, service: ContactoService = Depends(get_contacto_service)
) -> ContactoResponse:
    return service.create(data)


@router.get("/", response_model=Page[ContactoResponse])
def listar_contactos(service: ContactoService = Depends(get_contacto_service)):
    return paginate(service.db, service.list_query())


@router.get("/{contacto_id}", response_model=ContactoResponse)
def obtener_contacto(
    contacto_id: int, service: ContactoService = Depends(get_contacto_service)
) -> ContactoResponse:
    return service.get(contacto_id)


@router.put("/{contacto_id}", response_model=ContactoResponse)
def actualizar_contacto(
    contacto_id: int, data: ContactoUpdate, service: ContactoService = Depends(get_contacto_service)
) -> ContactoResponse:
    return service.update(contacto_id, data)


@router.delete("/{contacto_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_contacto(contacto_id: int, service: ContactoService = Depends(get_contacto_service)) -> None:
    service.delete(contacto_id)