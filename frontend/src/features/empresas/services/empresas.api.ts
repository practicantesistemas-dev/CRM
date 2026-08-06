import type { Empresa, EmpresaDraft } from '../types/empresa'
import { authHeader } from '@/features/auth/composables/useAuth'

const API_URL = import.meta.env.VITE_CRM_API_URL

// El backend devuelve el motivo puntual del rechazo en { detail }; mismo patrón que contactos.api.ts.
async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

interface EmpresaReadResponse {
  id: number
  razon_social: string
  nit: string
  industria: string | null
  direccion: string | null
  ciudad: string | null
  estado: boolean
  responsable_id: number | null
  fecha_creacion: string | null
  fecha_actualizacion: string | null
}

function mapEmpresaResponse(r: EmpresaReadResponse): Empresa {
  return {
    id: r.id,
    razonSocial: r.razon_social,
    nit: r.nit,
    industria: r.industria ?? '',
    direccion: r.direccion ?? '',
    ciudad: r.ciudad ?? '',
    estado: r.estado,
    responsableId: r.responsable_id,
    contactos: 0,
  }
}

export async function getEmpresas(): Promise<Empresa[]> {
  const response = await fetch(`${API_URL}/api/empresas/?limit=200`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudieron cargar las empresas.')
  const data: EmpresaReadResponse[] = await response.json()
  return data.map(mapEmpresaResponse)
}

export async function getEmpresa(id: number): Promise<Empresa> {
  const response = await fetch(`${API_URL}/api/empresas/${id}`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar la empresa.')
  const r: EmpresaReadResponse = await response.json()
  return mapEmpresaResponse(r)
}

// responsable_id no se manda: el backend lo resuelve él mismo a partir del usuario autenticado
// (Bearer token), igual que responsable_id en POST /api/contactos/.
export async function createEmpresa(data: EmpresaDraft): Promise<Empresa> {
  const body = {
    razon_social: data.razonSocial,
    nit: data.nit,
    industria: data.industria || null,
    direccion: data.direccion || null,
    ciudad: data.ciudad || null,
    estado: data.estado,
  }
  const response = await fetch(`${API_URL}/api/empresas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear la empresa.')
  const r: EmpresaReadResponse = await response.json()
  return mapEmpresaResponse(r)
}

export async function updateEmpresa(id: number, data: EmpresaDraft): Promise<Empresa> {
  const body = {
    razon_social: data.razonSocial,
    nit: data.nit,
    industria: data.industria || null,
    direccion: data.direccion || null,
    ciudad: data.ciudad || null,
    estado: data.estado,
  }
  const response = await fetch(`${API_URL}/api/empresas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar la empresa.')
  const r: EmpresaReadResponse = await response.json()
  return mapEmpresaResponse(r)
}

export async function deleteEmpresa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/empresas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo eliminar la empresa.')
}
