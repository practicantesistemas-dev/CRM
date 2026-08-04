import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type { Contacto, ContactoDraft, HistorialItem, TipoSeguimiento } from '../types/contacto'

export const CONTACTO_DRAFT_VACIO: ContactoDraft = {
  nombre: '', tipoDocumento: 'CC', documento: '', correo: '',
  telefono: '', empresa: '', cargo: '', ciudad: '', departamento: '', estado: 'Activo',
  tipoContacto: 'Prospecto', fechaNacimiento: '', sexo: '', etiquetas: []
}

// El backend solo admite estos dos valores para TipoContacto (confirmado contra el OpenAPI real).
export const TIPO_CONTACTO_OPTIONS: Contacto['tipoContacto'][] = ['Cliente', 'Prospecto']

export const HISTORIAL_MOCK: HistorialItem[] = [
  { tipo: 'Llamada',  desc: 'Llamada de seguimiento Plan Liga',                        fecha: '2026-06-28', usuario: 'María García',  icono: Phone,    color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',   desc: 'Envío propuesta comercial adjunta',                       fecha: '2026-06-20', usuario: 'Juan López',    icono: Mail,     color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Reunión',  desc: 'Presentación servicios Plan Liga',                        fecha: '2026-06-10', usuario: 'Carlos Torres', icono: Calendar, color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Nota',     desc: 'Cliente interesado en plan empresarial para 50 empleados', fecha: '2026-06-01', usuario: 'María García',  icono: FileText, color: '#059669', bg: '#D1FAE5' },
]

export const TIPOS_SEGUIMIENTO_META: Record<TipoSeguimiento, { icono: unknown; color: string; bg: string }> = {
  'Llamada':  { icono: Phone,          color: '#2447F9', bg: '#EEF2FF' },
  'Correo':   { icono: Mail,           color: '#EC4899', bg: '#FCE7F3' },
  'Reunión':  { icono: Calendar,       color: '#C9A227', bg: '#FEF9C3' },
  'WhatsApp': { icono: MessageCircle,  color: '#059669', bg: '#D1FAE5' },
  'Nota':     { icono: FileText,       color: '#1A2A6C', bg: '#E8EAF6' },
}

export const estadoStyle = (e: Contacto['estado']) => {
  switch (e) {
    case 'Activo':     return 'text-emerald-600'
    case 'Inactivo':   return 'text-slate-400'
    case 'Prospecto':  return 'text-amber-600'
    case 'En proceso': return 'text-[#1E3A8A]'
    default:           return 'text-slate-400'
  }
}
