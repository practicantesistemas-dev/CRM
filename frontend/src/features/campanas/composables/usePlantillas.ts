import { ref } from 'vue'
import type { GrupoCorreos, Plantilla, PlantillaDraft } from '../types/plantilla'
import {
  getPlantillas, crearPlantilla, actualizarPlantilla, duplicarPlantilla, eliminarPlantilla,
  getGrupos, guardarGrupo, eliminarGrupo,
} from '../services/plantillas.api'

export function usePlantillas() {
  const plantillas = ref<Plantilla[]>(getPlantillas())
  const grupos = ref<GrupoCorreos[]>(getGrupos())

  const refrescar = () => { plantillas.value = getPlantillas() }
  const refrescarGrupos = () => { grupos.value = getGrupos() }

  const crear = async (data: PlantillaDraft): Promise<Plantilla> => {
    const p = await crearPlantilla(data)
    refrescar()
    return p
  }
  const actualizar = async (id: string, data: PlantillaDraft): Promise<Plantilla | null> => {
    const p = await actualizarPlantilla(id, data)
    refrescar()
    return p
  }
  const duplicar = async (id: string) => { await duplicarPlantilla(id); refrescar() }
  const eliminar = (id: string) => { eliminarPlantilla(id); refrescar() }

  const guardarComoGrupo = (nombre: string, correos: string[]) => {
    guardarGrupo(nombre, correos)
    refrescarGrupos()
  }
  const borrarGrupo = (id: string) => { eliminarGrupo(id); refrescarGrupos() }

  return {
    plantillas, grupos,
    crear, actualizar, duplicar, eliminar,
    guardarComoGrupo, borrarGrupo, refrescar,
  }
}
