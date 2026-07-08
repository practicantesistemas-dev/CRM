import type { Oportunidad, OportunidadDraft, OportunidadPayload } from '../types/oportunidad'
import { OPORTUNIDADES_MOCK } from '../constants/oportunidades.constants'

let oportunidades: Oportunidad[] = [...OPORTUNIDADES_MOCK]

/** Limpia los campos de cliente según Empresa_id, Contacto_id y Plan_liga_titular_id: solo el/los id(s) relevantes al tipoCliente viajan diligenciados, el resto en null. */
export function toOportunidadPayload(data: OportunidadDraft): OportunidadPayload {
  return {
    tipo_cliente: data.tipoCliente,
    empresa_id: data.tipoCliente === 'empresa' ? data.empresaId : null,
    contacto_id: data.tipoCliente === 'empresa' || data.tipoCliente === 'contacto' ? data.contactoId : null,
    plan_liga_titular_id: data.tipoCliente === 'titular' ? data.planLigaTitularId : null,
    servicio: data.servicio,
    responsable: data.responsable,
    valor: data.valor,
    probabilidad: data.probabilidad,
    estado: data.estado,
  }
}

export function getOportunidades(): Oportunidad[] {
  return oportunidades
}

export function createOportunidad(data: OportunidadDraft): Oportunidad {
  const nueva: Oportunidad = { ...data, id: Date.now() }
  oportunidades = [nueva, ...oportunidades]
  return nueva
}

export function updateOportunidad(id: number, data: Partial<OportunidadDraft>): Oportunidad | null {
  const idx = oportunidades.findIndex(o => o.id === id)
  if (idx === -1) return null
  const actualizada: Oportunidad = { ...oportunidades[idx], ...data, id }
  oportunidades = [...oportunidades.slice(0, idx), actualizada, ...oportunidades.slice(idx + 1)]
  return actualizada
}
