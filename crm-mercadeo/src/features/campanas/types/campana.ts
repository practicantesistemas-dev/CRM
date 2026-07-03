export interface Campana {
  id: number
  nombre: string
  segmento: string
  estado: 'Borrador' | 'Enviada' | 'Programada'
  enviados: number
  aperturas: number
  clics: number
  rebotes: number
  fecha: string
}

export type CampanaDraft = Omit<Campana, 'id'>
