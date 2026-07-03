export type TipoActividad = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

export interface Actividad {
  id: number
  tipo: TipoActividad
  contacto: string
  empresa: string
  accion: string
  proximoPaso: string
  fecha: string
  usuario: string
}

export type ActividadDraft = Omit<Actividad, 'id'>
