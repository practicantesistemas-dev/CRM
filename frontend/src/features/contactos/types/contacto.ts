/** Etiqueta real del backend (GET/POST /api/etiquetas/), no un string libre. */
export interface Etiqueta {
  id: number
  nombre: string
  color: string
}

export type EtiquetaDraft = Omit<Etiqueta, 'id'>

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
  /** Solo se usa al crear (POST /api/contactos/ trae "departamento" separado de "municipio"). */
  departamento: string
  estado: 'Activo' | 'Inactivo' | 'Prospecto' | 'En proceso'
  /** Clasificación general del contacto en el backend (TipoContacto: solo admite estos dos valores). */
  tipoContacto: 'Cliente' | 'Prospecto'
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | ''
  etiquetas: Etiqueta[]
  responsable: string
}

// 'responsable' queda fuera: no se captura en el formulario, lo resuelve el backend
// a partir del usuario autenticado (Bearer token) al crear el contacto.
export type ContactoDraft = Omit<Contacto, 'id' | 'responsable'>

export type TipoSeguimiento = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

export interface SeguimientoDraft {
  tipo: TipoSeguimiento
  accion: string
  proximoPaso: string
  fecha: string
  /** Oportunidad a la que queda ligada la actividad en la bitácora; null si el contacto aún no tiene una oportunidad asociada. */
  oportunidadId: number | null
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
