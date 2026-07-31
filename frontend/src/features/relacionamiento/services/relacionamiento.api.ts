import type { Actividad, ActividadDraft, TipoActividad } from '../types/actividad'
import { getTitular } from '@/features/plan-liga/services/plan-liga.api'
import { authHeader } from '@/features/auth/composables/useAuth'

const API_URL = import.meta.env.VITE_CRM_API_URL

// Forma cruda de GET /api/bitacora/: paginada (items/total), snake_case. Trae contacto_nombre/
// usuario_nombre ya resueltos, pero no titular_nombre. nombre_empresa ya no es FK (no hay
// empresa_id): es texto libre, tal cual se escribió al crear el registro.
interface BitacoraApiItem {
  id: number
  tipo: string
  descripcion: string
  proximo_paso: string | null
  fecha: string
  estado: string
  usuario_id: number | null
  usuario_nombre: string | null
  contacto_id: number | null
  contacto_nombre: string | null
  nombre_empresa: string | null
  oportunidad_id: number | null
  titular_id: number | null
}

interface BitacoraListadoResponse {
  items: BitacoraApiItem[]
  total: number
  conteo_por_tipo: Record<string, number>
}

// El "tipo" que guarda el backend no es consistente en mayúsculas/tildes (ej. "Llamada",
// "Reunion", "nota" conviven en datos reales), así que la búsqueda se normaliza antes de mapear.
const normalizarTipo = (tipo: string) => tipo
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')

const TIPO_DESDE_API: Record<string, TipoActividad> = {
  llamada: 'Llamada', correo: 'Correo', reunion: 'Reunión', whatsapp: 'WhatsApp', nota: 'Nota',
}
const TIPO_A_API: Record<TipoActividad, string> = {
  Llamada: 'llamada', Correo: 'correo', Reunión: 'reunion', WhatsApp: 'whatsapp', Nota: 'nota',
}

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

// El endpoint no trae titular_nombre; se resuelve aparte con Plan Liga, que sí está
// conectado al backend real.
async function resolverTitularNombre(titularId: number | null): Promise<string> {
  if (titularId === null) return ''
  try {
    return (await getTitular(titularId)).nombre
  } catch {
    return ''
  }
}

function mapItem(r: BitacoraApiItem, titularNombre: string): Actividad {
  return {
    id: r.id,
    tipo: TIPO_DESDE_API[normalizarTipo(r.tipo)] ?? 'Nota',
    contactoId: r.contacto_id,
    contactoNombre: r.contacto_nombre ?? '',
    empresaNombre: r.nombre_empresa ?? '',
    titularId: r.titular_id,
    titularNombre,
    accion: r.descripcion,
    proximoPaso: r.proximo_paso ?? '',
    fecha: r.fecha.split('T')[0],
    usuario: r.usuario_nombre ?? '',
    oportunidadId: r.oportunidad_id,
  }
}

export async function getActividades(): Promise<Actividad[]> {
  const response = await fetch(`${API_URL}/api/bitacora/?limit=200`)
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar la bitácora.')
  const { items }: BitacoraListadoResponse = await response.json()

  const titularIds = [...new Set(items.map(d => d.titular_id).filter((id): id is number => id !== null))]
  const nombresPorTitular = new Map<number, string>()
  await Promise.all(titularIds.map(async (id) => { nombresPorTitular.set(id, await resolverTitularNombre(id)) }))

  return items
    .map(r => mapItem(r, r.titular_id !== null ? (nombresPorTitular.get(r.titular_id) ?? '') : ''))
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export async function createActividad(data: ActividadDraft): Promise<void> {
  const body = {
    tipo: TIPO_A_API[data.tipo],
    descripcion: data.accion,
    proximo_paso: data.proximoPaso || null,
    fecha: data.fecha,
    contacto_id: data.contactoId,
    nombre_empresa: data.empresaNombre || null,
    titular_id: data.titularId,
    oportunidad_id: data.oportunidadId,
    estado: 'realizado',
  }
  const response = await fetch(`${API_URL}/api/bitacora/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo registrar la actividad.')
}

export async function deleteActividad(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/bitacora/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo eliminar la actividad.')
}
