export type TipoActividad = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

export interface Actividad {
  id: number
  tipo: TipoActividad
  contactoId: number | null
  contactoNombre: string
  empresaId: number | null
  empresaNombre: string
  /** Titular Plan Liga asociado a la actividad; opcional, igual que contacto y empresa. */
  titularId: number | null
  titularNombre: string
  accion: string
  proximoPaso: string
  fecha: string
  usuario: string
  /** Oportunidad a la que queda ligada la actividad; null si aún no tiene una oportunidad asociada. */
  oportunidadId: number | null
}

export type ActividadDraft = Omit<Actividad, 'id'>
