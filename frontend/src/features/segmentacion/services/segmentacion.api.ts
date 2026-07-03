import type { FiltrosSegmento, Segmento } from '../types/segmento'
import { SEGMENTOS_MOCK } from '../constants/segmentacion.constants'

let segmentos: Segmento[] = [...SEGMENTOS_MOCK]

export function getSegmentos(): Segmento[] {
  return segmentos
}

export function createSegmento(nombre: string, filtros: FiltrosSegmento, total: number): Segmento {
  const nuevo: Segmento = {
    id: Date.now(),
    nombre,
    ...filtros,
    total,
    creadoEn: new Date().toISOString().split('T')[0],
  }
  segmentos = [nuevo, ...segmentos]
  return nuevo
}

export function duplicateSegmento(s: Segmento): Segmento {
  const copia: Segmento = { ...s, id: Date.now(), nombre: `${s.nombre} (copia)`, creadoEn: new Date().toISOString().split('T')[0] }
  segmentos = [copia, ...segmentos]
  return copia
}

export function deleteSegmento(id: number) {
  segmentos = segmentos.filter(s => s.id !== id)
}
