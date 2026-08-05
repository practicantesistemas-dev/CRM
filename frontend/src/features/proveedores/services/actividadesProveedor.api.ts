import { authHeader } from '@/features/auth/composables/useAuth'
import type { ActividadServicio, ActividadServicioDraft } from '../types/actividadServicio'

const API_URL = import.meta.env.VITE_CRM_API_URL

interface ActividadResponse {
  id: number
  nombre: string
  cantidad: number | null
  precio: number | null
  descripcion: string | null
  proveedor_id: number
}

interface ActividadListadoResponse {
  items: ActividadResponse[]
  total: number
}

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

function mapActividad(r: ActividadResponse): ActividadServicio {
  return {
    id: r.id,
    proveedorId: r.proveedor_id,
    nombre: r.nombre,
    cantidad: r.cantidad ?? 0,
    precio: r.precio ?? 0,
    descripcion: r.descripcion ?? '',
  }
}

function draftToBody(data: ActividadServicioDraft) {
  return {
    nombre: data.nombre,
    cantidad: data.cantidad,
    precio: data.precio,
    descripcion: data.descripcion || null,
    proveedor_id: data.proveedorId,
  }
}

export async function getActividadesProveedor(
  proveedorId: number,
  opts: { q?: string; limit?: number } = {},
): Promise<ActividadServicio[]> {
  const params = new URLSearchParams({ proveedor_id: String(proveedorId), limit: String(opts.limit ?? 4) })
  if (opts.q) params.set('q', opts.q)
  const response = await fetch(`${API_URL}/api/actividades/?${params}`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar las actividades del proveedor.')
  const data: ActividadListadoResponse = await response.json()
  return data.items.map(mapActividad)
}

export async function crearActividadProveedor(data: ActividadServicioDraft): Promise<ActividadServicio> {
  const response = await fetch(`${API_URL}/api/actividades/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(draftToBody(data)),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear la actividad.')
  return mapActividad(await response.json())
}

export async function actualizarActividadProveedor(id: number, data: ActividadServicioDraft): Promise<ActividadServicio> {
  const response = await fetch(`${API_URL}/api/actividades/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(draftToBody(data)),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar la actividad.')
  return mapActividad(await response.json())
}

export async function eliminarActividadProveedor(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/actividades/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo eliminar la actividad.')
}
