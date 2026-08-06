import type { Empresa, EmpresaDraft, HistorialItem } from '../types/empresa'

export const EMPRESA_DRAFT_VACIO: EmpresaDraft = {
  razonSocial: '', nit: '', industria: '', direccion: '', ciudad: '', estado: true,
}

// El backend no expone historial de actividad por empresa (solo bitácora por contacto),
// así que el drawer se queda con datos ilustrativos hasta que exista ese endpoint.
export const HISTORIAL_MOCK: HistorialItem[] = [
  { tipo: 'Reunión', desc: 'Presentación servicios Plan Liga Empresarial', fecha: '2026-06-25', usuario: 'María García', color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Correo', desc: 'Envío propuesta comercial 50 empleados', fecha: '2026-06-18', usuario: 'Juan López', color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Llamada', desc: 'Seguimiento cotización mensual', fecha: '2026-06-10', usuario: 'Carlos Torres', color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Nota', desc: 'Interesados en brigada de salud Q3', fecha: '2026-06-01', usuario: 'María García', color: '#059669', bg: '#D1FAE5' },
]

export const estadoStyle = (e: Empresa['estado']) => (e ? 'text-emerald-600' : 'text-slate-400')
export const estadoLabel = (e: Empresa['estado']) => (e ? 'Activa' : 'Inactiva')
