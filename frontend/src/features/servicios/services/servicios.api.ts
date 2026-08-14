import { authHeader } from '@/features/auth/composables/useAuth'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

// Categorías de intranet_planliga_tipo_plan (tabla externa del portal, de solo lectura).
export async function getServicios(): Promise<string[]> {
  const response = await fetch(`${API_URL}/api/servicios/categorias`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el listado de servicios.')
  return response.json()
}

export interface PlanServicio {
  id: number
  nombre: string
  tipoCliente: string
  beneficiarios: number
  beneficiariosAdicionales: number
  descripcion: string
  estado: 'Activo' | 'Inactivo'
}

interface PlanServicioResponse {
  id: number
  nombre: string
  tipo_cliente: string | null
  beneficiarios: number
  beneficiarios_adicionales: number | null
  descripcion: string | null
  estado: string | null
}

interface ServicioListadoResponse {
  items: PlanServicioResponse[]
  total: number
}

function mapPlanServicio(r: PlanServicioResponse): PlanServicio {
  return {
    id: r.id,
    nombre: r.nombre,
    tipoCliente: r.tipo_cliente ?? '',
    beneficiarios: r.beneficiarios,
    beneficiariosAdicionales: r.beneficiarios_adicionales ?? 0,
    descripcion: r.descripcion ?? '',
    estado: r.estado === 'A' ? 'Activo' : 'Inactivo',
  }
}

// Detalle de los planes que componen una categoría de servicio (ej. los 7 planes de "planliga").
export async function getPlanesDeCategoria(categoria: string): Promise<PlanServicio[]> {
  const params = new URLSearchParams({ categoria, limit: '200' })
  const response = await fetch(`${API_URL}/api/servicios/?${params}`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudieron cargar los planes de este servicio.')
  const data: ServicioListadoResponse = await response.json()
  return data.items.map(mapPlanServicio)
}

export interface PlanDraft {
  categoria: string
  nombre: string
  tipoCliente: 'Particular' | 'Empresarial'
  beneficiarios: number
  beneficiariosAdicionales: number
  descripcion: string
  estado: 'Activo' | 'Inactivo'
}

// Crea un plan nuevo en intranet_planliga_tipo_plan. Si "categoria" no existía todavía,
// esto la crea de hecho (es una categoría nueva del servicio); si ya existía, se agrega
// como un plan más de ese mismo servicio.
export async function createPlanServicio(data: PlanDraft): Promise<PlanServicio> {
  const body = {
    nombre: data.nombre,
    categoria: data.categoria,
    tipo_cliente: data.tipoCliente || null,
    beneficiarios: data.beneficiarios,
    beneficiarios_adicionales: data.beneficiariosAdicionales,
    descripcion: data.descripcion || null,
    estado: data.estado === 'Activo' ? 'A' : 'I',
  }
  const response = await fetch(`${API_URL}/api/servicios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el plan.')
  const r: PlanServicioResponse = await response.json()
  return mapPlanServicio(r)
}
