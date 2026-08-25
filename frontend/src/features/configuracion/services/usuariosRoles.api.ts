import { authHeader } from '@/features/auth/composables/useAuth'
import type { RolAsignable, UsuarioBusqueda } from '../types/usuarioRol'

const API_URL = import.meta.env.VITE_CRM_API_URL

interface UsuarioBusquedaResponse {
  id: number
  usuario: string
  nombres: string
  estado: string | null
  role_crm_id: number | null
  role_crm: string | null
}

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

function mapUsuario(r: UsuarioBusquedaResponse): UsuarioBusqueda {
  return {
    id: r.id,
    usuario: r.usuario,
    nombres: r.nombres,
    estado: r.estado,
    roleCrmId: r.role_crm_id,
    roleCrm: r.role_crm,
  }
}

export async function buscarUsuarios(nombre: string): Promise<UsuarioBusqueda[]> {
  const url = `${API_URL}/api/usuarios-roles/buscar?nombre=${encodeURIComponent(nombre)}`
  const response = await fetch(url, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo buscar usuarios.')
  const data: UsuarioBusquedaResponse[] = await response.json()
  return data.map(mapUsuario)
}

export async function getRolesAsignables(): Promise<RolAsignable[]> {
  const response = await fetch(`${API_URL}/api/usuarios-roles/roles-asignables`, {
    headers: authHeader(),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el listado de roles.')
  return response.json()
}

export async function asignarRol(usuarioId: number, rolId: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/usuarios-roles/${usuarioId}/rol`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ rol_id: rolId }),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo asignar el rol.')
}
