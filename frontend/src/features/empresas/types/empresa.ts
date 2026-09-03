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
  icono: unknown
  color: string
  bg: string
}

export interface SeguimientoEmpresaDraft {
  tipo: 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Mensaje' | 'Nota'
  accion: string
  proximoPaso: string
  /** Fecha límite del próximo paso; '' si no se definió una. */
  proximoPasoFecha: string
  fecha: string
}
