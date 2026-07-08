export type EtapaOportunidad = 'Lead' | 'Primer Contacto' | 'Reunión' | 'Cotización' | 'Negociación' | 'Ganada' | 'Perdida'

export type TipoCliente = 'empresa' | 'contacto' | 'titular'

export interface Oportunidad {
  id: number
  tipoCliente: TipoCliente
  empresaId: number | null
  empresaNombre: string
  contactoId: number | null
  contactoNombre: string
  planLigaTitularId: number | null
  titularNombre: string
  servicio: string
  responsable: string
  valor: string
  probabilidad: number
  estado: EtapaOportunidad
}

export type OportunidadDraft = Omit<Oportunidad, 'id'>

/** Forma en la que el Front envía la oportunidad al Backend: solo el id correspondiente al tipo de cliente va diligenciado, los demás viajan en null. */
export interface OportunidadPayload {
  tipo_cliente: TipoCliente
  empresa_id: number | null
  contacto_id: number | null
  plan_liga_titular_id: number | null
  servicio: string
  responsable: string
  valor: string
  probabilidad: number
  estado: EtapaOportunidad
}
