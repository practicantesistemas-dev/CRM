import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type { ActividadDraft, TipoActividad } from '../types/actividad'

export const TIPOS_ACTIVIDAD: TipoActividad[] = ['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']

export const TIPO_META: Record<TipoActividad, { icono: unknown; color: string; bg: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9', bg: '#EEF2FF' },
  'Correo':   { icono: Mail,          color: '#EC4899', bg: '#FCE7F3' },
  'Reunión':  { icono: Calendar,      color: '#C9A227', bg: '#FEF9C3' },
  'WhatsApp': { icono: MessageCircle, color: '#059669', bg: '#D1FAE5' },
  'Nota':     { icono: FileText,      color: '#1A2A6C', bg: '#E8EAF6' },
}

export const ACTIVIDAD_DRAFT_VACIO: ActividadDraft = {
  tipo: 'Llamada',
  contactoId: null, contactoNombre: '',
  empresaNombre: '',
  titularId: null, titularNombre: '',
  accion: '', proximoPaso: '', proximoPasoFecha: '',
  fecha: new Date().toISOString().split('T')[0], oportunidadId: null,
}
