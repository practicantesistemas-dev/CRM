import type { Actividad, ActividadDraft } from '../types/actividad'
import { ACTIVIDADES_MOCK } from '../constants/relacionamiento.constants'

let actividades: Actividad[] = [...ACTIVIDADES_MOCK]

export function getActividades(): Actividad[] {
  return actividades
}

export function createActividad(data: ActividadDraft): Actividad {
  const nueva: Actividad = { ...data, id: Date.now() }
  actividades = [nueva, ...actividades]
  return nueva
}
