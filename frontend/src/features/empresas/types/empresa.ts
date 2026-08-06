export interface Empresa {
  id: number
  razonSocial: string
  nit: string
  industria: string
  direccion: string
  ciudad: string
  estado: boolean
  responsableId: number | null
  /** Derivado en el cliente contando contactos por empresaId; no lo devuelve el backend. */
  contactos: number
}

export type EmpresaDraft = Omit<Empresa, 'id' | 'responsableId' | 'contactos'>

export interface HistorialItem {
  tipo: string
  desc: string
  fecha: string
  usuario: string
  color: string
  bg: string
}
