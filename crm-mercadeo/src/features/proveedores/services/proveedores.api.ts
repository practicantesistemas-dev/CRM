import type { Proveedor, ProveedorDraft } from '../types/proveedor'
import { PROVEEDORES_MOCK } from '../constants/proveedores.constants'

let proveedores: Proveedor[] = [...PROVEEDORES_MOCK]

export function getProveedores(): Proveedor[] {
  return proveedores
}

export function createProveedor(data: ProveedorDraft): Proveedor {
  const nuevo: Proveedor = { ...data, id: Date.now() }
  proveedores = [nuevo, ...proveedores]
  return nuevo
}

export function updateProveedor(id: number, data: ProveedorDraft): Proveedor | null {
  const idx = proveedores.findIndex(p => p.id === id)
  if (idx === -1) return null
  const actualizado: Proveedor = { ...data, id }
  proveedores = [...proveedores.slice(0, idx), actualizado, ...proveedores.slice(idx + 1)]
  return actualizado
}
