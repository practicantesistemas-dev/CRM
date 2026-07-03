import type { EtapaOportunidad, Oportunidad, OportunidadDraft } from '../types/oportunidad'

export const ETAPAS: EtapaOportunidad[] = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']

export const OPORTUNIDADES_MOCK: Oportunidad[] = [
  { id: 1, empresa: 'Global Tech S.A.S', contacto: 'Carlos Mendoza', servicio: 'Plan Liga Empresarial', responsable: 'María García', valor: '$18.000.000', probabilidad: 75, estado: 'Cotización' },
  { id: 2, empresa: 'Constructora ABC', contacto: 'Pedro Sánchez', servicio: 'Brigadas de Salud', responsable: 'Carlos Torres', valor: '$5.500.000', probabilidad: 90, estado: 'Negociación' },
  { id: 3, empresa: 'Farmacia Norte', contacto: 'Laura Gómez', servicio: 'Tamizajes', responsable: 'María García', valor: '$2.200.000', probabilidad: 40, estado: 'Reunión' },
  { id: 4, empresa: 'Estética Mayo', contacto: 'Ana Ruiz', servicio: 'Plan Liga Empresarial', responsable: 'Juan López', valor: '$12.000.000', probabilidad: 60, estado: 'Primer Contacto' },
  { id: 5, empresa: 'Tech Solutions', contacto: 'Roberto Díaz', servicio: 'Capacitaciones', responsable: 'Juan López', valor: '$3.800.000', probabilidad: 25, estado: 'Lead' },
  { id: 6, empresa: 'Innova Group', contacto: 'Valentina Cruz', servicio: 'Plan Liga Empresarial', responsable: 'Carlos Torres', valor: '$22.000.000', probabilidad: 95, estado: 'Ganada' },
  { id: 7, empresa: 'SalvaTech', contacto: 'Jorge Ramírez', servicio: 'Programas de Bienestar', responsable: 'María García', valor: '$4.100.000', probabilidad: 10, estado: 'Perdida' },
]

export const OPORTUNIDAD_DRAFT_VACIO: OportunidadDraft = {
  empresa: '', contacto: '', servicio: '', responsable: '',
  valor: '', probabilidad: 50, estado: 'Lead',
}

export const estadoStyle = (e: EtapaOportunidad) => {
  const map: Record<EtapaOportunidad, string> = {
    'Lead':           'text-slate-400',
    'Primer Contacto':'text-[#1E3A8A]',
    'Reunión':        'text-[#9D174D]',
    'Cotización':     'text-amber-600',
    'Negociación':    'text-[#1A2A6C]',
    'Ganada':         'text-emerald-600',
    'Perdida':        'text-red-500',
  }
  return map[e] ?? 'bg-slate-100 text-slate-500 border-slate-200'
}
