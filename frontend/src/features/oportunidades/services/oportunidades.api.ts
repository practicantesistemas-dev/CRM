import type { Oportunidad, OportunidadDraft } from '../types/oportunidad'
import { OPORTUNIDADES_MOCK } from '../constants/oportunidades.constants'

let oportunidades: Oportunidad[] = [...OPORTUNIDADES_MOCK]

export function getOportunidades(): Oportunidad[] {
  return oportunidades
}

export function createOportunidad(data: OportunidadDraft): Oportunidad {
  const nueva: Oportunidad = { ...data, id: Date.now() }
  oportunidades = [nueva, ...oportunidades]
  return nueva
}

export function updateOportunidad(id: number, data: Partial<OportunidadDraft>): Oportunidad | null {
  const idx = oportunidades.findIndex(o => o.id === id)
  if (idx === -1) return null
  const actualizada: Oportunidad = { ...oportunidades[idx], ...data, id }
  oportunidades = [...oportunidades.slice(0, idx), actualizada, ...oportunidades.slice(idx + 1)]
  return actualizada
}
