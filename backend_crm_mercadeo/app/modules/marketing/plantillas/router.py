from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_username
from app.modules.marketing.plantillas.dependencies import get_plantillas_service
from app.modules.marketing.plantillas.schemas import PlantillaGuardar, PlantillaRead
from app.modules.marketing.plantillas.service import PlantillasService

router = APIRouter(
    prefix="/plantillas",
    tags=["Plantillas de correo"],
    dependencies=[Depends(get_current_username)],
)


# Guardar (primera vez): crea la fila en mercadeo_crm_plantillas_correo.
# usuario_id y usuario_actualizacion_id quedan igual al creador.
@router.post("", response_model=PlantillaRead, status_code=status.HTTP_201_CREATED)
def crear_plantilla(
    datos: PlantillaGuardar,
    username: str = Depends(get_current_username),
    service: PlantillasService = Depends(get_plantillas_service),
) -> PlantillaRead:
    return service.crear(datos, username)


# Guardar un ajuste sobre una plantilla ya existente: modifica esa misma fila
# (usuario_actualizacion_id pasa a ser quien hizo este ajuste).
@router.put("/{id_plantilla}", response_model=PlantillaRead)
def actualizar_plantilla(
    id_plantilla: int,
    datos: PlantillaGuardar,
    username: str = Depends(get_current_username),
    service: PlantillasService = Depends(get_plantillas_service),
) -> PlantillaRead:
    plantilla = service.actualizar(id_plantilla, datos, username)
    if plantilla is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Plantilla no encontrada")
    return plantilla
