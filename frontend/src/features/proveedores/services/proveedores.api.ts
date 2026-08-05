import { authHeader } from '@/features/auth/composables/useAuth'
import type { Proveedor, ProveedorDraft } from '../types/proveedor'

const API_URL = import.meta.env.VITE_CRM_API_URL

interface ProveedorResponse {
  id: number
  nombre: string
  categoria: string | null
  nit: string | null
  correo: string | null
  telefono: string | null
  estado: boolean
}

interface ProveedorListadoResponse {
  items: ProveedorResponse[]
  total: number
}

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

function mapProveedor(r: ProveedorResponse): Proveedor {
  return {
    id: r.id,
    nombre: r.nombre,
    categoria: r.categoria ?? '',
    nit: r.nit ?? '',
    correo: r.correo ?? '',
    telefono: r.telefono ?? '',
    estado: r.estado ? 'Activo' : 'Inactivo',
  }
}

function draftToBody(data: ProveedorDraft) {
  return {
    nombre: data.nombre,
    categoria: data.categoria || null,
    nit: data.nit || null,
    correo: data.correo || null,
    telefono: data.telefono || null,
    estado: data.estado === 'Activo',
  }
}

export async function getProveedores(): Promise<Proveedor[]> {
  const response = await fetch(`${API_URL}/api/proveedores/?limit=200`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el listado de proveedores.')
  const data: ProveedorListadoResponse = await response.json()
  return data.items.map(mapProveedor)
}

export async function createProveedor(data: ProveedorDraft): Promise<Proveedor> {
  const response = await fetch(`${API_URL}/api/proveedores/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(draftToBody(data)),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el proveedor.')
  const r: ProveedorResponse = await response.json()
  return mapProveedor(r)
}

export async function updateProveedor(id: number, data: ProveedorDraft): Promise<Proveedor> {
  const response = await fetch(`${API_URL}/api/proveedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(draftToBody(data)),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar el proveedor.')
  const r: ProveedorResponse = await response.json()
  return mapProveedor(r)
}

export async function deleteProveedor(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/proveedores/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo eliminar el proveedor.')
}
