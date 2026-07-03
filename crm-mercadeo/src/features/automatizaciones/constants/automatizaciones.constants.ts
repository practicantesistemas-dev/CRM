import {
  Users, GitBranch, CalendarClock, Clock, Megaphone, FileText, Bell,
  Mail, Zap, RefreshCw, Phone,
} from 'lucide-vue-next'
import type {
  Automatizacion, AutomatizacionDraft, EstadoAutomatizacion, TipoAccion, TipoTrigger,
} from '../types/automatizacion'

export const AUTOMATIZACIONES_MOCK: Automatizacion[] = [
  {
    id: 1,
    nombre: 'Bienvenida nuevo contacto',
    descripcion: 'Envía un correo de bienvenida cuando se registra un nuevo contacto en el CRM.',
    trigger: 'Nuevo contacto',
    accion: 'Enviar correo',
    estado: 'Activa',
    ejecuciones: 147,
    ultimaEjecucion: '2026-06-30T09:14:00',
    creadoPor: 'María García',
    creadoEn: '2026-01-15',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Alerta etapa Cotización',
    descripcion: 'Notifica al responsable cuando una oportunidad avanza a la etapa de Cotización.',
    trigger: 'Cambio de etapa',
    accion: 'Notificar responsable',
    estado: 'Activa',
    ejecuciones: 83,
    ultimaEjecucion: '2026-06-29T16:45:00',
    creadoPor: 'Juan López',
    creadoEn: '2026-02-01',
    activo: true,
  },
  {
    id: 3,
    nombre: 'Seguimiento inactivo 7 días',
    descripcion: 'Crea una tarea de seguimiento si un contacto no ha tenido actividad en 7 días.',
    trigger: 'Sin actividad 7 días',
    accion: 'Crear tarea',
    estado: 'Activa',
    ejecuciones: 212,
    ultimaEjecucion: '2026-06-30T06:00:00',
    creadoPor: 'Carlos Torres',
    creadoEn: '2026-02-10',
    activo: true,
  },
  {
    id: 4,
    nombre: 'Recordatorio fecha seguimiento',
    descripcion: 'Envía un WhatsApp al responsable 1 día antes de la fecha de seguimiento programada.',
    trigger: 'Fecha de seguimiento',
    accion: 'Enviar WhatsApp',
    estado: 'Pausada',
    ejecuciones: 56,
    ultimaEjecucion: '2026-06-22T08:30:00',
    creadoPor: 'María García',
    creadoEn: '2026-03-05',
    activo: false,
  },
  {
    id: 5,
    nombre: 'Registro Plan Liga · bienvenida',
    descripcion: 'Al inscribir un nuevo titular en Plan Liga, envía correo de confirmación y crea actividad.',
    trigger: 'Inscripción Plan Liga',
    accion: 'Enviar correo',
    estado: 'Activa',
    ejecuciones: 34,
    ultimaEjecucion: '2026-06-28T11:20:00',
    creadoPor: 'Juan López',
    creadoEn: '2026-03-20',
    activo: true,
  },
  {
    id: 6,
    nombre: 'Error API correos',
    descripcion: 'Asigna etiqueta "Campaña" automáticamente cuando se envía una campaña masiva.',
    trigger: 'Campaña enviada',
    accion: 'Asignar etiqueta',
    estado: 'Error',
    ejecuciones: 18,
    ultimaEjecucion: '2026-06-25T14:10:00',
    creadoPor: 'Carlos Torres',
    creadoEn: '2026-04-01',
    activo: true,
  },
  {
    id: 7,
    nombre: 'Nuevo beneficiario · notificación',
    descripcion: 'Notifica al responsable del titular cuando se agrega un nuevo beneficiario.',
    trigger: 'Nuevo beneficiario',
    accion: 'Notificar responsable',
    estado: 'Activa',
    ejecuciones: 29,
    ultimaEjecucion: '2026-06-30T07:55:00',
    creadoPor: 'María García',
    creadoEn: '2026-04-18',
    activo: true,
  },
]

export const TRIGGER_META: Record<TipoTrigger, { icono: unknown; color: string; bg: string }> = {
  'Nuevo contacto':       { icono: Users,        color: '#2447F9', bg: '#EEF2FF' },
  'Cambio de etapa':      { icono: GitBranch,    color: '#1A2A6C', bg: '#E8EAF6' },
  'Fecha de seguimiento': { icono: CalendarClock, color: '#C9A227', bg: '#FEF9C3' },
  'Sin actividad 7 días': { icono: Clock,        color: '#EC4899', bg: '#FCE7F3' },
  'Campaña enviada':      { icono: Megaphone,    color: '#059669', bg: '#D1FAE5' },
  'Formulario completado':{ icono: FileText,     color: '#6366F1', bg: '#EEF2FF' },
  'Nuevo beneficiario':   { icono: Users,        color: '#EC4899', bg: '#FCE7F3' },
  'Inscripción Plan Liga':{ icono: Bell,         color: '#EC4899', bg: '#FCE7F3' },
}

export const ACCION_META: Record<TipoAccion, { icono: unknown; color: string }> = {
  'Enviar correo':          { icono: Mail,      color: '#2447F9' },
  'Crear tarea':            { icono: FileText,  color: '#C9A227' },
  'Notificar responsable':  { icono: Bell,      color: '#EC4899' },
  'Mover etapa':            { icono: GitBranch, color: '#1A2A6C' },
  'Asignar etiqueta':       { icono: Zap,       color: '#059669' },
  'Crear actividad':        { icono: RefreshCw, color: '#6366F1' },
  'Enviar WhatsApp':        { icono: Phone,     color: '#059669' },
}

export const ESTADO_STYLE: Record<EstadoAutomatizacion, string> = {
  'Activa':  'text-emerald-600',
  'Pausada': 'text-amber-600',
  'Error':   'text-red-500',
}

export const TRIGGERS: TipoTrigger[] = [
  'Nuevo contacto', 'Cambio de etapa', 'Fecha de seguimiento',
  'Sin actividad 7 días', 'Campaña enviada', 'Formulario completado',
  'Nuevo beneficiario', 'Inscripción Plan Liga',
]

export const ACCIONES: TipoAccion[] = [
  'Enviar correo', 'Crear tarea', 'Notificar responsable',
  'Mover etapa', 'Asignar etiqueta', 'Crear actividad', 'Enviar WhatsApp',
]

export const AUTOMATIZACION_DRAFT_VACIO: AutomatizacionDraft = {
  nombre: '',
  descripcion: '',
  trigger: 'Nuevo contacto',
  accion: 'Enviar correo',
}

export const formatDate = (iso: string | null) => {
  if (!iso) return 'Nunca'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
