import type { Empresa, EmpresaDraft } from '../types/empresa'
import { EMPRESAS_MOCK } from '../constants/empresas.constants'

let empresas: Empresa[] = [...EMPRESAS_MOCK]

export function getEmpresas(): Empresa[] {
  return empresas
}

export function createEmpresa(data: EmpresaDraft): Empresa {
  const nueva: Empresa = { ...data, id: Date.now(), servicios: [...data.servicios] }
  empresas = [nueva, ...empresas]
  return nueva
}

export function updateEmpresa(id: number, data: EmpresaDraft): Empresa | null {
  const idx = empresas.findIndex(e => e.id === id)
  if (idx === -1) return null
  const actualizada: Empresa = { ...data, id, servicios: [...data.servicios] }
  empresas = [...empresas.slice(0, idx), actualizada, ...empresas.slice(idx + 1)]
  return actualizada
}
