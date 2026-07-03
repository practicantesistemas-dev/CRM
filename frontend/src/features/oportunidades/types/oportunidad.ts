export type EtapaOportunidad = 'Lead' | 'Primer Contacto' | 'Reunión' | 'Cotización' | 'Negociación' | 'Ganada' | 'Perdida'

export interface Oportunidad {
  id: number
  empresa: string
  contacto: string
  servicio: string
  responsable: string
  valor: string
  probabilidad: number
  estado: EtapaOportunidad
}

export type OportunidadDraft = Omit<Oportunidad, 'id'>
