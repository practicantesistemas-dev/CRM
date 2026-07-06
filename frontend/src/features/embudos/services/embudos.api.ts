import type { Tarjeta, TarjetaDraft } from '../types/tarjeta'
import { TARJETAS_MOCK } from '../constants/embudos.constants'

let tarjetas: Tarjeta[] = [...TARJETAS_MOCK]

export function getTarjetas(): Tarjeta[] {
  return tarjetas
}

export function createTarjeta(data: TarjetaDraft): Tarjeta {
  const nueva: Tarjeta = { ...data, id: Date.now() }
  tarjetas = [...tarjetas, nueva]
  return nueva
}

export function moverTarjeta(
  id: number,
  etapa: string,
  targetId: number | null = null,
  position: 'before' | 'after' | null = null,
): Tarjeta[] {
  const idx = tarjetas.findIndex(t => t.id === id)
  if (idx === -1) return tarjetas

  const actualizada: Tarjeta = { ...tarjetas[idx], etapa }
  const resto = [...tarjetas.slice(0, idx), ...tarjetas.slice(idx + 1)]

  let insertAt = resto.length
  if (targetId !== null) {
    const targetIdx = resto.findIndex(t => t.id === targetId)
    if (targetIdx !== -1) insertAt = position === 'after' ? targetIdx + 1 : targetIdx
  }

  tarjetas = [...resto.slice(0, insertAt), actualizada, ...resto.slice(insertAt)]
  return tarjetas
}
