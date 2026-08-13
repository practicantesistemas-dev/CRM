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
