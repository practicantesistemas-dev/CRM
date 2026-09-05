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

  const crear = (data: PlantillaDraft): Plantilla => {
    const p = crearPlantilla(data)
    refrescar()
    return p
  }
  const actualizar = (id: string, data: PlantillaDraft): Plantilla | null => {
    const p = actualizarPlantilla(id, data)
    refrescar()
    return p
  }
  const duplicar = (id: string) => { duplicarPlantilla(id); refrescar() }
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
