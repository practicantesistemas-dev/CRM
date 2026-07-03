import { Phone, Mail, Calendar, MessageCircle, FileText } from 'lucide-vue-next'
import type { Contacto, ContactoDraft, HistorialItem, TipoSeguimiento } from '../types/contacto'

export const CONTACTOS_MOCK: Contacto[] = [
  { id: 1, nombre: 'Carlos Mendoza',      tipoDocumento: 'CC', documento: '10293844',   correo: 'carlos.mendoza@globaltech.com', telefono: '300-555-0192', empresa: 'Global Tech S.A.S',    cargo: 'Gerente Comercial',      ciudad: 'Pereira',      estado: 'Activo',     fechaNacimiento: '1989-03-15', sexo: 'Masculino', etiquetas: ['VIP', 'Plan Liga'], responsable: 'María García'  },
  { id: 2, nombre: 'Ana Victoria Ruiz',   tipoDocumento: 'CC', documento: '25841203',   correo: 'ana.ruiz@esteticamayo.com',    telefono: '311-222-4455', empresa: 'Estética Mayo',         cargo: 'CEO',                    ciudad: 'Bogotá',       estado: 'En proceso', fechaNacimiento: '1985-07-22', sexo: 'Femenino',  etiquetas: ['Interesado'],       responsable: 'Juan López'    },
  { id: 3, nombre: 'Pedro Sánchez Mejía', tipoDocumento: 'CC', documento: '71234567',   correo: 'pedro@constructoraabc.co',     telefono: '314-888-1122', empresa: 'Constructora ABC',      cargo: 'Director de RRHH',       ciudad: 'Medellín',     estado: 'Activo',     fechaNacimiento: '1978-11-08', sexo: 'Masculino', etiquetas: ['Plan Liga', 'Empresarial'], responsable: 'Carlos Torres' },
  { id: 4, nombre: 'Laura Gómez Vargas',  tipoDocumento: 'CC', documento: '43901234',   correo: 'laura.gomez@farmanorte.com',  telefono: '320-777-3344', empresa: 'Farmacia Norte',        cargo: 'Coordinadora Bienestar', ciudad: 'Manizales',    estado: 'Prospecto',  fechaNacimiento: '1993-05-30', sexo: 'Femenino',  etiquetas: ['Nuevo'],            responsable: 'María García'  },
  { id: 5, nombre: 'Roberto Díaz Castro', tipoDocumento: 'CC', documento: '19283746',   correo: 'roberto@techsolutions.co',    telefono: '301-444-9988', empresa: 'Tech Solutions',        cargo: 'CTO',                    ciudad: 'Cali',         estado: 'Activo',     fechaNacimiento: '1982-09-14', sexo: 'Masculino', etiquetas: ['VIP'],              responsable: 'Juan López'    },
  { id: 6, nombre: 'Sandra Morales López',tipoDocumento: 'CC', documento: '52000111',   correo: 'smorales@grupoXYZ.com',       telefono: '316-555-7766', empresa: 'Grupo Empresarial XYZ', cargo: 'Jefe de Talento Humano', ciudad: 'Bogotá',       estado: 'En proceso', fechaNacimiento: '1990-01-18', sexo: 'Femenino',  etiquetas: ['Plan Liga'],        responsable: 'Carlos Torres' },
  { id: 7, nombre: 'Jorge Ramírez Pérez', tipoDocumento: 'CC', documento: '80123456',   correo: 'jorge.ramirez@salvatech.co',  telefono: '312-333-6655', empresa: 'SalvaTech',             cargo: 'Gerente General',        ciudad: 'Barranquilla', estado: 'Inactivo',   fechaNacimiento: '1975-06-25', sexo: 'Masculino', etiquetas: [],                   responsable: 'María García'  },
  { id: 8, nombre: 'Valentina Cruz',       tipoDocumento: 'CC', documento: '1098765432', correo: 'vcruz@innovagroup.com',       telefono: '318-999-2211', empresa: 'Innova Group',          cargo: 'Analista Comercial',     ciudad: 'Pereira',      estado: 'Activo',     fechaNacimiento: '1997-12-03', sexo: 'Femenino',  etiquetas: ['Interesado', 'Nuevo'], responsable: 'Juan López'  },
]

export const CONTACTO_DRAFT_VACIO: ContactoDraft = {
  nombre: '', tipoDocumento: 'CC', documento: '', correo: '',
  telefono: '', empresa: '', cargo: '', ciudad: '', estado: 'Prospecto',
  fechaNacimiento: '', sexo: 'Masculino', etiquetas: [], responsable: ''
}

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

export const etiquetaColor = (tag: string) => {
  const map: Record<string, string> = {
    'VIP':        'text-[#92400E]',
    'Plan Liga':  'text-[#1E3A8A]',
    'Interesado': 'text-[#9D174D]',
    'Empresarial':'text-[#1A2A6C]',
    'Nuevo':      'text-[#065F46]',
  }
  return map[tag] ?? 'text-slate-500'
}
