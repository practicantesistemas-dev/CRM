import type { Servicio, ServicioDraft } from '../types/servicio'

export const SERVICIOS_MOCK: Servicio[] = [
  { id: 1, nombre: 'Plan Liga Empresarial', codigo: 'PLE-001', categoria: 'Plan Liga', responsable: 'María García', estado: 'Activo', tipo: 'Empresarial', empresasInteresadas: 24, contactosInteresados: 312, ventas: 18, conversion: '42%', valorPotencial: '$45.000.000', solicitudes: 312 },
  { id: 2, nombre: 'Plan Liga Individual', codigo: 'PLI-001', categoria: 'Plan Liga', responsable: 'Juan López', estado: 'Activo', tipo: 'Individual', empresasInteresadas: 0, contactosInteresados: 245, ventas: 86, conversion: '35%', valorPotencial: '$12.300.000', solicitudes: 245 },
  { id: 3, nombre: 'Tamizajes', codigo: 'TAM-001', categoria: 'Salud Preventiva', responsable: 'Carlos Torres', estado: 'Activo', tipo: 'Salud', empresasInteresadas: 11, contactosInteresados: 134, ventas: 41, conversion: '31%', valorPotencial: '$8.200.000', solicitudes: 134 },
  { id: 4, nombre: 'Brigadas de Salud', codigo: 'BRI-001', categoria: 'Salud Preventiva', responsable: 'María García', estado: 'Activo', tipo: 'Salud', empresasInteresadas: 9, contactosInteresados: 187, ventas: 52, conversion: '28%', valorPotencial: '$15.600.000', solicitudes: 187 },
  { id: 5, nombre: 'Capacitaciones', codigo: 'CAP-001', categoria: 'Bienestar', responsable: 'Juan López', estado: 'En revisión', tipo: 'Bienestar', empresasInteresadas: 6, contactosInteresados: 89, ventas: 14, conversion: '16%', valorPotencial: '$4.500.000', solicitudes: 89 },
  { id: 6, nombre: 'Programas de Bienestar', codigo: 'BIE-001', categoria: 'Bienestar', responsable: 'Carlos Torres', estado: 'Activo', tipo: 'Bienestar', empresasInteresadas: 8, contactosInteresados: 102, ventas: 22, conversion: '22%', valorPotencial: '$9.800.000', solicitudes: 102 },
]

export const SERVICIO_DRAFT_VACIO: ServicioDraft = {
  nombre: '', codigo: '', categoria: '', responsable: '', estado: 'Activo',
  tipo: 'Empresarial', empresasInteresadas: 0, contactosInteresados: 0,
  ventas: 0, conversion: '0%', valorPotencial: '', solicitudes: 0,
}

export const TIPOS_SERVICIO = ['Empresarial', 'Individual', 'Salud', 'Bienestar'] as const

export const estadoStyle = (e: Servicio['estado']) => {
  if (e === 'Activo')   return 'text-emerald-600'
  if (e === 'Inactivo') return 'text-slate-400'
  return 'text-amber-600'
}

export const tipoColor = (t: Servicio['tipo']) => {
  const map: Record<Servicio['tipo'], string> = {
    'Empresarial': 'text-[#1E3A8A]',
    'Individual':  'text-[#9D174D]',
    'Bienestar':   'text-[#065F46]',
    'Salud':       'text-[#92400E]',
  }
  return map[t] ?? 'text-slate-500'
}

export const tipoBarColor = (tipo: string) =>
  tipo === 'Empresarial' ? '#2447F9' : tipo === 'Individual' ? '#EC4899' : tipo === 'Salud' ? '#C9A227' : '#059669'
