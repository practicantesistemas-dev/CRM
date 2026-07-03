import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type { Actividad, ActividadDraft, TipoActividad } from '../types/actividad'

export const TIPOS_ACTIVIDAD: TipoActividad[] = ['Llamada', 'Correo', 'Reunión', 'WhatsApp', 'Nota']

export const TIPO_META: Record<TipoActividad, { icono: unknown; color: string; bg: string }> = {
  'Llamada':  { icono: Phone,         color: '#2447F9', bg: '#EEF2FF' },
  'Correo':   { icono: Mail,          color: '#EC4899', bg: '#FCE7F3' },
  'Reunión':  { icono: Calendar,      color: '#C9A227', bg: '#FEF9C3' },
  'WhatsApp': { icono: MessageCircle, color: '#059669', bg: '#D1FAE5' },
  'Nota':     { icono: FileText,      color: '#1A2A6C', bg: '#E8EAF6' },
}

export const ACTIVIDADES_MOCK: Actividad[] = [
  { id: 1, tipo: 'Llamada',  contacto: 'Carlos Mendoza',    empresa: 'Global Tech S.A.S',     accion: 'Seguimiento propuesta Plan Liga 50 empleados', proximoPaso: 'Enviar cotización ajustada',    fecha: '2026-06-28', usuario: 'María García'  },
  { id: 2, tipo: 'Correo',   contacto: 'Ana Victoria Ruiz', empresa: 'Estética Mayo',          accion: 'Envío de propuesta comercial con tarifas 2026', proximoPaso: 'Llamada de cierre el lunes',   fecha: '2026-06-27', usuario: 'Juan López'    },
  { id: 3, tipo: 'Reunión',  contacto: 'Pedro Sánchez',     empresa: 'Constructora ABC',       accion: 'Presentación servicios brigada de salud Q3',    proximoPaso: 'Enviar acta de reunión',        fecha: '2026-06-26', usuario: 'Carlos Torres' },
  { id: 4, tipo: 'WhatsApp', contacto: 'Laura Gómez',       empresa: 'Farmacia Norte',         accion: 'Confirmación agenda tamizaje semana del 7/jul', proximoPaso: 'Coordinar con logística',       fecha: '2026-06-25', usuario: 'María García'  },
  { id: 5, tipo: 'Nota',     contacto: 'Roberto Díaz',      empresa: 'Tech Solutions',         accion: 'Cliente interesado plan empresarial Q4 2026',   proximoPaso: 'Recordar en agosto',            fecha: '2026-06-24', usuario: 'Juan López'    },
  { id: 6, tipo: 'Llamada',  contacto: 'Sandra Morales',    empresa: 'Grupo Empresarial XYZ',  accion: 'Negociación condiciones pago semestral',        proximoPaso: 'Consultar gerencia descuento',  fecha: '2026-06-23', usuario: 'Carlos Torres' },
  { id: 7, tipo: 'Correo',   contacto: 'Valentina Cruz',    empresa: 'Innova Group',           accion: 'Bienvenida al Plan Liga Empresarial',           proximoPaso: 'Programar kick-off',            fecha: '2026-06-22', usuario: 'María García'  },
  { id: 8, tipo: 'Reunión',  contacto: 'Jorge Ramírez',     empresa: 'SalvaTech',              accion: 'Primer contacto presencial en sede cliente',    proximoPaso: 'Enviar brochure digital',       fecha: '2026-06-20', usuario: 'Juan López'    },
]

export const ACTIVIDAD_DRAFT_VACIO: ActividadDraft = {
  tipo: 'Llamada', contacto: '', empresa: '', accion: '', proximoPaso: '',
  fecha: new Date().toISOString().split('T')[0], usuario: '',
}
