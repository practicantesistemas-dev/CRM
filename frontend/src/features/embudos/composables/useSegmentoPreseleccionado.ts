import type { FiltroSegmento } from '../constants/ciclo-afiliado.constants'

// Pasa los criterios de un "Segmento guardado" al segmentador de afiliados
// cuando se navega de una vista a otra. Se consume una sola vez.
let pendiente: Partial<FiltroSegmento> | null = null

export const setSegmentoPreseleccionado = (f: Partial<FiltroSegmento>) => { pendiente = f }

export const getSegmentoPreseleccionado = (): Partial<FiltroSegmento> | null => {
  const p = pendiente
  pendiente = null
  return p
}
