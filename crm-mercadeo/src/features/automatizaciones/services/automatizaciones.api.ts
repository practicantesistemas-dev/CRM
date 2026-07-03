import type { Automatizacion, AutomatizacionDraft } from '../types/automatizacion'
import { AUTOMATIZACIONES_MOCK } from '../constants/automatizaciones.constants'

let automatizaciones: Automatizacion[] = [...AUTOMATIZACIONES_MOCK]

export function getAutomatizaciones(): Automatizacion[] {
  return automatizaciones
}

export function createAutomatizacion(data: AutomatizacionDraft): Automatizacion {
  const nueva: Automatizacion = {
    id: Date.now(),
    ...data,
    estado: 'Activa',
    ejecuciones: 0,
    ultimaEjecucion: null,
    creadoPor: 'Usuario actual',
    creadoEn: new Date().toISOString().split('T')[0],
    activo: true,
  }
  automatizaciones = [nueva, ...automatizaciones]
  return nueva
}

export function updateAutomatizacion(id: number, data: Partial<Automatizacion>): Automatizacion | null {
  const idx = automatizaciones.findIndex(a => a.id === id)
  if (idx === -1) return null
  const actualizada: Automatizacion = { ...automatizaciones[idx], ...data, id }
  automatizaciones = [...automatizaciones.slice(0, idx), actualizada, ...automatizaciones.slice(idx + 1)]
  return actualizada
}

export function deleteAutomatizacion(id: number) {
  automatizaciones = automatizaciones.filter(a => a.id !== id)
}
