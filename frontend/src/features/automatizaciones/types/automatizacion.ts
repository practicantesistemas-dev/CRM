export type EstadoAutomatizacion = 'Activa' | 'Pausada' | 'Error'

export type TipoAccion =
  | 'Enviar correo'
  | 'Crear tarea'
  | 'Notificar responsable'
  | 'Mover etapa'
  | 'Asignar etiqueta'
  | 'Crear actividad'
  | 'Enviar WhatsApp'

export interface Automatizacion {
  id: number
  nombre: string
  descripcion: string
  accion: TipoAccion
  /** Correos destino (separados por coma), solo aplica cuando accion === 'Enviar correo'. */
  correos: string
  /** Asunto y cuerpo del correo, solo aplican cuando accion === 'Enviar correo'. */
  asunto: string
  cuerpo: string
  estado: EstadoAutomatizacion
  ejecuciones: number
  ultimaEjecucion: string | null
  creadoPor: string
  creadoEn: string
  activo: boolean
}

export interface AutomatizacionDraft {
  nombre: string
  descripcion: string
  accion: TipoAccion
  correos: string
  asunto: string
  cuerpo: string
}
