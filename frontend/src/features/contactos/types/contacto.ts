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
  /** Nombre legible (ej. "Pereira"), para tabla/filtros. */
  ciudad: string
  /** Nombre legible (ej. "Risaralda"), para tabla/filtros. */
  departamento: string
  /** Código DIVIPOLA crudo del municipio, tal como lo maneja el backend (option-value del Select). */
  ciudadCodigo: string
  /** Código DIVIPOLA crudo del departamento. */
  departamentoCodigo: string
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
// 'ciudadCodigo'/'departamentoCodigo' quedan fuera: en el draft, 'ciudad'/'departamento' YA
// son el código (los Select del formulario usan option-value="codigo" directamente).
export type ContactoDraft = Omit<Contacto, 'id' | 'responsable' | 'ciudadCodigo' | 'departamentoCodigo'>

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
