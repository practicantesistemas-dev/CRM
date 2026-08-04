import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type { Contacto, ContactoDraft, TipoSeguimiento } from '../types/contacto'

export const CONTACTO_DRAFT_VACIO: ContactoDraft = {
  nombre: '', tipoDocumento: 'CC', documento: '', correo: '',
  telefono: '', empresa: '', cargo: '', ciudad: '', departamento: '', estado: 'Activo',
  tipoContacto: 'Prospecto', fechaNacimiento: '', sexo: '', etiquetas: []
}

// El backend solo admite estos dos valores para TipoContacto (confirmado contra el OpenAPI real).
export const TIPO_CONTACTO_OPTIONS: Contacto['tipoContacto'][] = ['Cliente', 'Prospecto']

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
