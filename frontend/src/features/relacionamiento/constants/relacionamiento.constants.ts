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
  { id: 1, tipo: 'Llamada',  contactoId: 1, contactoNombre: 'Carlos Mendoza',       empresaId: 1,    empresaNombre: 'Global Tech S.A.S',     titularId: null, titularNombre: '', accion: 'Seguimiento propuesta Plan Liga 50 empleados',  proximoPaso: 'Enviar cotización ajustada',    fecha: '2026-06-28', usuario: 'María García',  oportunidadId: 1 },
  { id: 2, tipo: 'Correo',   contactoId: 2, contactoNombre: 'Ana Victoria Ruiz',    empresaId: 4,    empresaNombre: 'Estética Mayo',          titularId: null, titularNombre: '', accion: 'Envío de propuesta comercial con tarifas 2026', proximoPaso: 'Llamada de cierre el lunes',    fecha: '2026-06-27', usuario: 'Juan López',    oportunidadId: 4 },
  { id: 3, tipo: 'Reunión',  contactoId: 3, contactoNombre: 'Pedro Sánchez Mejía',  empresaId: 2,    empresaNombre: 'Constructora ABC',       titularId: null, titularNombre: '', accion: 'Presentación servicios brigada de salud Q3',    proximoPaso: 'Enviar acta de reunión',        fecha: '2026-06-26', usuario: 'Carlos Torres', oportunidadId: 2 },
  { id: 4, tipo: 'WhatsApp', contactoId: 4, contactoNombre: 'Laura Gómez Vargas',   empresaId: 3,    empresaNombre: 'Farmacia Norte',         titularId: null, titularNombre: '', accion: 'Confirmación agenda tamizaje semana del 7/jul', proximoPaso: 'Coordinar con logística',       fecha: '2026-06-25', usuario: 'María García',  oportunidadId: 3 },
  { id: 5, tipo: 'Nota',     contactoId: null, contactoNombre: '',                 empresaId: null, empresaNombre: '',                       titularId: 5,    titularNombre: 'Roberto Díaz Castro', accion: 'Cliente interesado plan empresarial Q4 2026', proximoPaso: 'Recordar en agosto',            fecha: '2026-06-24', usuario: 'Juan López',    oportunidadId: 5 },
  { id: 6, tipo: 'Llamada',  contactoId: 6, contactoNombre: 'Sandra Morales López', empresaId: 6,    empresaNombre: 'Grupo Empresarial XYZ', titularId: 6,    titularNombre: 'Sandra Morales López', accion: 'Negociación condiciones pago semestral',      proximoPaso: 'Consultar gerencia descuento',  fecha: '2026-06-23', usuario: 'Carlos Torres', oportunidadId: 6 },
  { id: 7, tipo: 'Correo',   contactoId: 8, contactoNombre: 'Valentina Cruz',       empresaId: null, empresaNombre: '',                       titularId: null, titularNombre: '', accion: 'Bienvenida al Plan Liga Empresarial',           proximoPaso: 'Programar kick-off',            fecha: '2026-06-22', usuario: 'María García',  oportunidadId: null },
  { id: 8, tipo: 'Reunión',  contactoId: 7, contactoNombre: 'Jorge Ramírez Pérez',  empresaId: null, empresaNombre: '',                       titularId: null, titularNombre: '', accion: 'Primer contacto presencial en sede cliente',    proximoPaso: 'Enviar brochure digital',       fecha: '2026-06-20', usuario: 'Juan López',    oportunidadId: null },
]

export const ACTIVIDAD_DRAFT_VACIO: ActividadDraft = {
  tipo: 'Llamada',
  contactoId: null, contactoNombre: '',
  empresaId: null, empresaNombre: '',
  titularId: null, titularNombre: '',
  accion: '', proximoPaso: '',
  fecha: new Date().toISOString().split('T')[0], usuario: '', oportunidadId: null,
}
