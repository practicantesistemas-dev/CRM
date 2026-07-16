export interface Titular {
  id: number
  documento: string
  nombre: string
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | 'Otro'
  correo: string
  telefono: string
  empresa: string
  planContratado: string
  fechaInscripcion: string
  estado: 'Activo' | 'Inactivo'
}

export type TitularDraft = Omit<Titular, 'id'>

export interface Beneficiario {
  id: number
  titularId: number
  documento: string
  nombre: string
  fechaNacimiento: string
  parentesco: string
  estado: 'Activo' | 'Inactivo' | 'Reemplazado' | 'Retirado'
  fechaInscripcion: string
}

export type BeneficiarioDraft = Omit<Beneficiario, 'id' | 'titularId'>

export type TipoSeguimiento = 'Llamada' | 'Correo' | 'Reunión' | 'WhatsApp' | 'Nota'

export interface SeguimientoDraft {
  tipo: TipoSeguimiento
  accion: string
  proximoPaso: string
  fecha: string
  /** Oportunidad a la que queda ligada la actividad en la bitácora; null si el titular aún no tiene una oportunidad asociada. */
  oportunidadId: number | null
}

export type TipoImportacion = 'activar_titular' | 'activar_beneficiario' | 'reemplazar' | 'desactivar'

export interface OpcionImportacion {
  key: TipoImportacion
  label: string
  desc: string
  color: string
  bg: string
}

export interface ResultadoImportacion {
  total: number
  exitosos: number
  errores: number
}

export interface ResumenTitularesResponse {
  titulares_activos: number
  beneficiarios_activos: number
}

