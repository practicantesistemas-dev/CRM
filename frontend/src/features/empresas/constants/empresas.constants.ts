import type { Empresa, EmpresaDraft, HistorialItem } from '../types/empresa'

export const EMPRESAS_MOCK: Empresa[] = [
  { id: 1, razonSocial: 'Global Tech S.A.S', nit: '900.123.456-7', industria: 'Tecnología', direccion: 'Cra 8 #20-15', ciudad: 'Pereira', responsable: 'María García', estado: 'Activa', contactos: 3, servicios: ['Plan Liga Empresarial'] },
  { id: 2, razonSocial: 'Constructora ABC', nit: '800.987.654-3', industria: 'Construcción', direccion: 'Av. Américas #45-67', ciudad: 'Medellín', responsable: 'Carlos Torres', estado: 'Activa', contactos: 5, servicios: ['Plan Liga Empresarial', 'Brigadas de Salud'] },
  { id: 3, razonSocial: 'Farmacia Norte', nit: '700.111.222-1', industria: 'Salud', direccion: 'Calle 10 #5-30', ciudad: 'Manizales', responsable: 'María García', estado: 'Prospecto', contactos: 1, servicios: [] },
  { id: 4, razonSocial: 'Estética Mayo', nit: '901.555.333-5', industria: 'Belleza', direccion: 'Carrera 15 #80-20', ciudad: 'Bogotá', responsable: 'Juan López', estado: 'Activa', contactos: 2, servicios: ['Tamizajes'] },
  { id: 5, razonSocial: 'Tech Solutions', nit: '830.666.777-9', industria: 'Tecnología', direccion: 'Av. Roosevelt #38-11', ciudad: 'Cali', responsable: 'Juan López', estado: 'Inactiva', contactos: 1, servicios: [] },
  { id: 6, razonSocial: 'Grupo Empresarial XYZ', nit: '900.444.555-2', industria: 'Comercio', direccion: 'Calle 100 #15-30', ciudad: 'Bogotá', responsable: 'Carlos Torres', estado: 'Activa', contactos: 4, servicios: ['Plan Liga Empresarial', 'Capacitaciones'] },
]

export const EMPRESA_DRAFT_VACIO: EmpresaDraft = {
  razonSocial: '', nit: '', industria: '', direccion: '', ciudad: '',
  responsable: '', estado: 'Prospecto', contactos: 0, servicios: [],
}

export const HISTORIAL_MOCK: HistorialItem[] = [
  { tipo: 'Reunión', desc: 'Presentación servicios Plan Liga Empresarial', fecha: '2026-06-25', usuario: 'María García', color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Correo', desc: 'Envío propuesta comercial 50 empleados', fecha: '2026-06-18', usuario: 'Juan López', color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Llamada', desc: 'Seguimiento cotización mensual', fecha: '2026-06-10', usuario: 'Carlos Torres', color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Nota', desc: 'Interesados en brigada de salud Q3', fecha: '2026-06-01', usuario: 'María García', color: '#059669', bg: '#D1FAE5' },
]

export const estadoStyle = (e: Empresa['estado']) => {
  if (e === 'Activa')   return 'text-emerald-600'
  if (e === 'Inactiva') return 'text-slate-400'
  return 'text-amber-600'
}
