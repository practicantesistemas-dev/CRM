export interface Titular {
  id: number
  tipoDocumento: string
  documento: string
  nombre: string
  fechaNacimiento: string
  sexo: 'Masculino' | 'Femenino' | 'Otro'
  correo: string
  telefono: string
  direccion: string
  ciudad: string
  departamento: string
  empresa: string
  planContratado: string
  tipoPlan: string
  tipoAfiliado: string
  eps: string
  otraEps: string
  planSalud: string
  planNombre: string
  fechaInscripcion: string
  estado: 'Activo' | 'Inactivo'
  /** Detalle por plan (nombre + cupo) cuando el titular viene del listado del backend. */
  planesDetalle?: PlanTitular[]
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

export interface PlanTitular {
  nombre: string
  activos: number
  cupo: number
}

export interface TitularListadoResponse {
  ID_TITULAR: number
  TITULAR: string
  EMAIL: string
  TELEFONO: string
  TIPO_DOCUMENTO: string
  DOCUMENTO: string
  EMPRESA: string
  PLANES: string
  BENEFICIARIOS: string
  INSCRIPCION: string
  ESTADO: string
}

export interface ListadoTitularesResponse {
  items: TitularListadoResponse[]
  total: number
  limit: number
  offset: number
}

export interface TitularDetalleResponse {
  ID_TITULAR: number
  DOCUMENTO: string
  TIPO_DOCUMENTO: string
  NOMBRE1: string
  NOMBRE2: string | null
  APELLIDO1: string
  APELLIDO2: string | null
  FECHA_NACIMIENTO: string | null
  SEXO: string | null
  CORREO: string | null
  TELEFONO: string | null
  DIRECCION: string | null
  CIUDAD: string | null
  DEPARTAMENTO: string | null
  TIPO_PLAN: string | null
  TIPO_AFILIADO: string | null
  EMPRESA: string | null
  EPS: string | null
  OTRAEPS: string | null
  PLAN_SALUD: string | null
  PLAN_NOMBRE: string | null
  ESTADO: string
  FECHA_INGRESO: string | null
}

