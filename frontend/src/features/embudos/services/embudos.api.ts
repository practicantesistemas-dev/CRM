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

export function moverTarjeta(id: number, etapa: string): Tarjeta | null {
  const idx = tarjetas.findIndex(t => t.id === id)
  if (idx === -1) return null
  const actualizada: Tarjeta = { ...tarjetas[idx], etapa }
  tarjetas = [...tarjetas.slice(0, idx), actualizada, ...tarjetas.slice(idx + 1)]
  return actualizada
}
