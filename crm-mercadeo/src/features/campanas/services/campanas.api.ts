import type { Campana, CampanaDraft } from '../types/campana'
import { CAMPANAS_MOCK } from '../constants/campanas.constants'

let campanas: Campana[] = [...CAMPANAS_MOCK]

export function getCampanas(): Campana[] {
  return campanas
}

export function createCampana(data: CampanaDraft): Campana {
  const nueva: Campana = { ...data, id: Date.now() }
  campanas = [nueva, ...campanas]
  return nueva
}
