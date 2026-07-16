import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft, ResumenTitularesResponse } from '../types/plan-liga'
import { BENEFICIARIOS_MOCK, TITULARES_MOCK } from '../constants/plan-liga.constants'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function obtenerJson<T>(ruta: string, mensajeError: string): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`)
  if (!response.ok) throw new Error(mensajeError)
  return response.json()
}

let titulares: Titular[] = [...TITULARES_MOCK]
let beneficiarios: Beneficiario[] = [...BENEFICIARIOS_MOCK]

export function getTitulares(): Titular[] {
  return titulares
}

export function createTitular(data: TitularDraft): Titular {
  const nuevo: Titular = { ...data, id: Date.now() }
  titulares = [nuevo, ...titulares]
  return nuevo
}

export function updateTitular(id: number, data: Partial<TitularDraft>): Titular | null {
  const idx = titulares.findIndex(t => t.id === id)
  if (idx === -1) return null
  const actualizado: Titular = { ...titulares[idx], ...data, id }
  titulares = [...titulares.slice(0, idx), actualizado, ...titulares.slice(idx + 1)]
  return actualizado
}

export function getBeneficiarios(): Beneficiario[] {
  return beneficiarios
}

export function createBeneficiario(titularId: number, data: BeneficiarioDraft): Beneficiario {
  const nuevo: Beneficiario = { ...data, id: Date.now(), titularId }
  beneficiarios = [...beneficiarios, nuevo]
  return nuevo
}

export function updateBeneficiario(id: number, data: Partial<BeneficiarioDraft>): Beneficiario | null {
  const idx = beneficiarios.findIndex(b => b.id === id)
  if (idx === -1) return null
  const actualizado: Beneficiario = { ...beneficiarios[idx], ...data, id }
  beneficiarios = [...beneficiarios.slice(0, idx), actualizado, ...beneficiarios.slice(idx + 1)]
  return actualizado
}

export async function getResumenTitulares(): Promise<ResumenTitularesResponse> {
  return obtenerJson<ResumenTitularesResponse>(
    '/api/titulares-beneficiarios/resumen',
    'No se pudo cargar el resumen de titulares.',
  )
}
