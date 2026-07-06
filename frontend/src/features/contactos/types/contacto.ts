export interface Contacto {
  id: number
  nombre: string
  tipoDocumento: 'CC' | 'CE' | 'TI' | 'NIT' | 'PP'
  documento: string
  correo: string
  telefono: string
  empresa: string
  cargo: string
  ciudad: string
  estado: 'Activo' | 'Inactivo' | 'Prospecto' | 'En proceso'
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | 'Otro'
  etiquetas: string[]
  responsable: string
}

export type ContactoDraft = Omit<Contacto, 'id'>

export type TipoSeguimiento = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

export interface SeguimientoDraft {
  tipo: TipoSeguimiento
  accion: string
  proximoPaso: string
  fecha: string
}

export interface HistorialItem {
  tipo: string
  desc: string
  fecha: string
  usuario: string
  icono: unknown
  color: string
  bg: string
}
