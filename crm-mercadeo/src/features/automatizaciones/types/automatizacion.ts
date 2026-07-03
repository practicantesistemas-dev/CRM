export type EstadoAutomatizacion = 'Activa' | 'Pausada' | 'Error'

export type TipoTrigger =
  | 'Nuevo contacto'
  | 'Cambio de etapa'
  | 'Fecha de seguimiento'
  | 'Sin actividad 7 días'
  | 'Campaña enviada'
  | 'Formulario completado'
  | 'Nuevo beneficiario'
  | 'Inscripción Plan Liga'

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
  trigger: TipoTrigger
  accion: TipoAccion
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
  trigger: TipoTrigger
  accion: TipoAccion
}
