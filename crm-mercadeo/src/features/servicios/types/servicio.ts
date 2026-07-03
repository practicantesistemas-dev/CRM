export interface Servicio {
  id: number
  nombre: string
  codigo: string
  categoria: string
  responsable: string
  estado: 'Activo' | 'Inactivo' | 'En revisión'
  tipo: 'Empresarial' | 'Individual' | 'Bienestar' | 'Salud'
  empresasInteresadas: number
  contactosInteresados: number
  ventas: number
  conversion: string
  valorPotencial: string
  solicitudes: number
}

export type ServicioDraft = Omit<Servicio, 'id'>
