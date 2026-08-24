import {
  GitBranch, FileText, Bell, Mail, Zap, RefreshCw, Phone,
} from 'lucide-vue-next'
import type {
  Automatizacion, AutomatizacionDraft, EstadoAutomatizacion, TipoAccion,
} from '../types/automatizacion'

export const AUTOMATIZACIONES_MOCK: Automatizacion[] = [
  {
    id: 1,
    nombre: 'Bienvenida nuevo contacto',
    descripcion: 'Envía un correo de bienvenida cuando se registra un nuevo contacto en el CRM.',
    accion: 'Enviar correo',
    correos: 'bienvenida@laliga.org.co',
    asunto: '¡Bienvenido a Liga Contra el Cáncer!',
    cuerpo: 'Gracias por registrarte con nosotros. Pronto un asesor se pondrá en contacto contigo.',
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
    accion: 'Notificar responsable',
    correos: '',
    asunto: '',
    cuerpo: '',
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
    accion: 'Crear tarea',
    correos: '',
    asunto: '',
    cuerpo: '',
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
    accion: 'Enviar WhatsApp',
    correos: '',
    asunto: '',
    cuerpo: '',
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
    accion: 'Enviar correo',
    correos: 'planliga@laliga.org.co',
    asunto: 'Confirmación de inscripción a Plan Liga',
    cuerpo: 'Hemos recibido tu inscripción al Plan Liga. En breve recibirás más información sobre los siguientes pasos.',
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
    accion: 'Asignar etiqueta',
    correos: '',
    asunto: '',
    cuerpo: '',
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
    accion: 'Notificar responsable',
    correos: '',
    asunto: '',
    cuerpo: '',
    estado: 'Activa',
    ejecuciones: 29,
    ultimaEjecucion: '2026-06-30T07:55:00',
    creadoPor: 'María García',
    creadoEn: '2026-04-18',
    activo: true,
  },
]

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
  'Activa':  'text-emerald-600 dark:text-emerald-400',
  'Pausada': 'text-amber-600 dark:text-amber-400',
  'Error':   'text-red-500 dark:text-red-400',
}

// Por ahora la única acción disponible para crear/editar es "Enviar correo".
export const ACCIONES: TipoAccion[] = ['Enviar correo']

export const AUTOMATIZACION_DRAFT_VACIO: AutomatizacionDraft = {
  nombre: '',
  descripcion: '',
  accion: 'Enviar correo',
  correos: '',
  asunto: '',
  cuerpo: '',
}

// Se añade al final del cuerpo de todo correo enviado por automatización, para dejar claro
// que es un flujo automático y no se debe responder a esa dirección.
export const AVISO_CORREO_AUTOMATICO =
  'Este es un mensaje generado automáticamente por el sistema; por favor, no responda a este correo.'

export const formatDate = (iso: string | null) => {
  if (!iso) return 'Nunca'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
