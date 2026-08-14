import type { EtapaOportunidad, Oportunidad, OportunidadDraft, TipoCliente } from '../types/oportunidad'
import { formatMoneyCOP } from '@/shared/utils/formatters'
import { joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import { authHeader } from '@/features/auth/composables/useAuth'

const API_URL = import.meta.env.VITE_CRM_API_URL

// El backend devuelve el motivo puntual del rechazo en { detail }; mismo patrón que contactos.api.ts.
async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

interface OportunidadReadResponse {
  id: number
  tipo_cliente: TipoCliente
  empresa_id: number | null
  contacto_id: number | null
  plan_liga_titular_id: number | null
  servicio_nombre: string | null
  responsable_id: number | null
  valor: number | null
  probabilidad: number | null
  estado: string | null
  etapa: EtapaOportunidad | null
  empresa: { id: number; razon_social: string; ciudad: string | null } | null
  contacto: { id: number; nombre1: string; apellido1: string | null; cargo: string | null } | null
  titular: {
    id: number
    nombre1: string | null
    nombre2: string | null
    apellido1: string | null
    apellido2: string | null
    empresa: string | null
  } | null
  responsable: { id: number; nombres: string | null } | null
}

// "estado" en la respuesta del backend es un resumen amplio (Abierta/Ganada/Perdida), no la
// etapa puntual del kanban: la etapa real viaja en "etapa" (FK a mercadeo_crm_etapas_embudo),
// que es lo que la UI conoce como `estado: EtapaOportunidad`.
function mapOportunidadResponse(r: OportunidadReadResponse): Oportunidad {
  return {
    id: r.id,
    tipoCliente: r.tipo_cliente,
    empresaId: r.empresa_id,
    empresaNombre: r.empresa?.razon_social ?? '',
    contactoId: r.contacto_id,
    contactoNombre: r.contacto ? [r.contacto.nombre1, r.contacto.apellido1].filter(Boolean).join(' ') : '',
    planLigaTitularId: r.plan_liga_titular_id,
    titularNombre: r.titular
      ? joinNombreCompleto({
          nombre1: r.titular.nombre1 ?? '', nombre2: r.titular.nombre2 ?? '',
          apellido1: r.titular.apellido1 ?? '', apellido2: r.titular.apellido2 ?? '',
        })
      : '',
    servicio: r.servicio_nombre ?? '',
    responsable: r.responsable?.nombres ?? '',
    valor: formatMoneyCOP(String(Math.round(r.valor ?? 0))),
    probabilidad: r.probabilidad ?? 0,
    estado: r.etapa ?? 'Lead',
  }
}

// Solo el/los id(s) relevantes al tipoCliente viajan diligenciados, el resto en null (mismo
// criterio que ya aplicaba el toOportunidadPayload original, ahora inline).
function idsDeCliente(data: Pick<OportunidadDraft, 'tipoCliente' | 'empresaId' | 'contactoId' | 'planLigaTitularId'>) {
  return {
    empresa_id: data.tipoCliente === 'empresa' ? data.empresaId : null,
    contacto_id: data.tipoCliente === 'empresa' || data.tipoCliente === 'contacto' ? data.contactoId : null,
    plan_liga_titular_id: data.tipoCliente === 'titular' ? data.planLigaTitularId : null,
  }
}

function valorANumero(valor: string): number {
  return Number(valor.replace(/[^0-9]/g, '')) || 0
}

export async function getOportunidades(): Promise<Oportunidad[]> {
  const response = await fetch(`${API_URL}/api/oportunidades/?limit=200`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el listado de oportunidades.')
  const data: OportunidadReadResponse[] = await response.json()
  return data.map(mapOportunidadResponse)
}

// responsable_id no se manda: el responsable es quien crea la oportunidad, y el backend lo
// resuelve él mismo a partir del Bearer token (mismo patrón que POST /api/contactos/).
export async function createOportunidad(data: OportunidadDraft): Promise<Oportunidad> {
  const body = {
    ...idsDeCliente(data),
    servicio_nombre: data.servicio || null,
    valor: valorANumero(data.valor),
    probabilidad: data.probabilidad,
    etapa: data.estado,
  }
  const response = await fetch(`${API_URL}/api/oportunidades/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear la oportunidad.')
  const r: OportunidadReadResponse = await response.json()
  return mapOportunidadResponse(r)
}

// Partial: se usa tanto para editar todos los campos del formulario (draft completo) como
// para acciones puntuales como marcarGanada/marcarPerdida (solo estado + probabilidad).
export async function updateOportunidad(id: number, data: Partial<OportunidadDraft>): Promise<Oportunidad> {
  const body: Record<string, unknown> = {}
  if (data.tipoCliente !== undefined) {
    Object.assign(body, idsDeCliente({
      tipoCliente: data.tipoCliente,
      empresaId: data.empresaId ?? null,
      contactoId: data.contactoId ?? null,
      planLigaTitularId: data.planLigaTitularId ?? null,
    }))
  }
  if (data.servicio !== undefined) body.servicio_nombre = data.servicio || null
  if (data.valor !== undefined) body.valor = valorANumero(data.valor)
  if (data.probabilidad !== undefined) body.probabilidad = data.probabilidad
  if (data.estado !== undefined) body.etapa = data.estado

  const response = await fetch(`${API_URL}/api/oportunidades/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar la oportunidad.')
  const r: OportunidadReadResponse = await response.json()
  return mapOportunidadResponse(r)
}
