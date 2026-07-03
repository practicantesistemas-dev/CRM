export interface Empresa {
  id: number
  razonSocial: string
  nit: string
  industria: string
  direccion: string
  ciudad: string
  responsable: string
  estado: 'Activa' | 'Inactiva' | 'Prospecto'
  contactos: number
  servicios: string[]
}

export type EmpresaDraft = Omit<Empresa, 'id'>

export interface HistorialItem {
  tipo: string
  desc: string
  fecha: string
  usuario: string
  color: string
  bg: string
}
