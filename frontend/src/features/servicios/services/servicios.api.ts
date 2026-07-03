import type { Servicio, ServicioDraft } from '../types/servicio'
import { SERVICIOS_MOCK } from '../constants/servicios.constants'

let servicios: Servicio[] = [...SERVICIOS_MOCK]

export function getServicios(): Servicio[] {
  return servicios
}

export function createServicio(data: ServicioDraft): Servicio {
  const nuevo: Servicio = { ...data, id: Date.now() }
  servicios = [nuevo, ...servicios]
  return nuevo
}

export function updateServicio(id: number, data: Partial<ServicioDraft>): Servicio | null {
  const idx = servicios.findIndex(s => s.id === id)
  if (idx === -1) return null
  const actualizado: Servicio = { ...servicios[idx], ...data, id }
  servicios = [...servicios.slice(0, idx), actualizado, ...servicios.slice(idx + 1)]
  return actualizado
}
