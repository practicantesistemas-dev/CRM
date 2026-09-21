import { authHeader } from '@/features/auth/composables/useAuth'
import type { FiltroSegmento } from '../constants/ciclo-afiliado.constants'

const API_URL = import.meta.env.VITE_CRM_API_URL

export interface AudienciaItemApi {
  IDENTIFICACION: string | null
  NOMBRES: string | null
  EMPRESA: string | null
  SEXO: string | null
  EDAD: number | null
  CIUDAD: string | null
  DEPARTAMENTO: string | null
  CORREO: string | null
  TELEFONO: string | null
  TIPO_PLAN: string | null
  CONCEPTO: string | null
  SERVICIO: string | null
  ESPECIALIDAD: string | null
  SERVICIOS_USADOS: number | null
  ULTIMO_USO: string | null
  TIPO_VINCULACION: string | null
}

export interface ListadoAudienciaApi {
  total: number
  items: AudienciaItemApi[]
}

/** Fila de la tabla de Audiencias (mapeo del consolidado). */
export interface PersonaAudiencia {
  id: string
  nombre: string
  documento: string
  direccion: string
  plan: string
  vinculacion: string
  ultimoUsoDias: number | null
  nServicios: number
  tieneCorreo: boolean
  tieneCelular: boolean
  correo: string | null
  telefono: string | null
  concepto: string | null
  servicio: string | null
}

async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

function diasDesde(fechaIso: string | null): number | null {
  if (!fechaIso) return null
  const fecha = new Date(`${fechaIso}T00:00:00`)
  if (Number.isNaN(fecha.getTime())) return null
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return Math.max(0, Math.floor((hoy.getTime() - fecha.getTime()) / 86_400_000))
}

export function mapAudienciaItem(item: AudienciaItemApi): PersonaAudiencia {
  const documento = (item.IDENTIFICACION ?? '').trim()
  const ciudad = (item.CIUDAD ?? '').trim()
  const depto = (item.DEPARTAMENTO ?? '').trim()
  const direccion = [ciudad, depto].filter(Boolean).join(' · ') || '—'
  return {
    id: documento || `${item.NOMBRES ?? 'sin-id'}-${item.ULTIMO_USO ?? ''}`,
    nombre: (item.NOMBRES ?? '').trim() || 'Sin nombre',
    documento,
    direccion,
    plan: (item.TIPO_PLAN ?? '').trim() || '—',
    vinculacion: (item.TIPO_VINCULACION ?? '').trim() || '—',
    ultimoUsoDias: diasDesde(item.ULTIMO_USO),
    nServicios: item.SERVICIOS_USADOS ?? 0,
    tieneCorreo: Boolean(item.CORREO?.trim()),
    tieneCelular: Boolean(item.TELEFONO?.trim()),
    correo: item.CORREO,
    telefono: item.TELEFONO,
    concepto: item.CONCEPTO,
    servicio: item.SERVICIO,
  }
}

/** Traduce el filtro de Embudos a query params de GET /api/segmentos/audiencias. */
export function filtroSegmentoAQuery(f: FiltroSegmento): URLSearchParams {
  const q = new URLSearchParams()

  if (f.planLiga === 'No plan Liga') q.set('plan', 'no_plan_liga')
  else q.set('plan', 'plan_liga')

  if (f.sexo === 'F' || f.sexo === 'M') q.set('sexo', f.sexo)

  const edadMin = f.edadMin.trim() === '' ? null : Number(f.edadMin)
  const edadMax = f.edadMax.trim() === '' ? null : Number(f.edadMax)
  if (edadMin !== null && !Number.isNaN(edadMin)) q.set('edad_min', String(edadMin))
  if (edadMax !== null && !Number.isNaN(edadMax)) q.set('edad_max', String(edadMax))

  if (f.ciudades.length) q.set('ciudad', f.ciudades[0].toUpperCase())
  if (f.conceptos.length) q.set('concepto', f.conceptos[0])
  if (f.servicios.length) q.set('servicio', f.servicios[0])

  if (f.vinculacion === 'Particular') q.set('tipo_vinculacion', 'particular')
  else if (f.vinculacion === 'Empresa') q.set('tipo_vinculacion', 'empresa')

  if (f.ultimoUso === '90' || f.ultimoUso === '60' || f.ultimoUso === '30') {
    q.set('ultimo_uso', f.ultimoUso)
  }

  return q
}

export async function getAudiencias(f: FiltroSegmento): Promise<{ total: number; items: PersonaAudiencia[] }> {
  // Varias ciudades: una petición por ciudad y se unen por documento.
  const ciudades = f.ciudades.length ? f.ciudades : [null]
  const resultados = await Promise.all(
    ciudades.map(async (ciudad) => {
      const filtro = ciudad === null ? f : { ...f, ciudades: [ciudad] }
      const params = filtroSegmentoAQuery(filtro)
      const response = await fetch(`${API_URL}/api/segmentos/audiencias?${params}`, {
        headers: authHeader(),
      })
      if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar la audiencia.')
      return (await response.json()) as ListadoAudienciaApi
    }),
  )

  const porId = new Map<string, PersonaAudiencia>()
  for (const r of resultados) {
    for (const item of r.items) {
      const persona = mapAudienciaItem(item)
      if (!porId.has(persona.id)) porId.set(persona.id, persona)
    }
  }
  const items = [...porId.values()]
  return { total: items.length, items }
}
