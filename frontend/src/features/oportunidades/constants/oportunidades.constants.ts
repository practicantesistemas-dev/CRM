import { Building2, User, Award } from 'lucide-vue-next'
import type { EtapaOportunidad, Oportunidad, OportunidadDraft, TipoCliente } from '../types/oportunidad'

export const ETAPAS: EtapaOportunidad[] = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']

export const TIPOS_CLIENTE: { value: TipoCliente; label: string; icono: unknown }[] = [
  { value: 'empresa', label: 'Empresa', icono: Building2 },
  { value: 'contacto', label: 'Contacto', icono: User },
  { value: 'titular', label: 'Titular Plan Liga', icono: Award },
]

export const OPORTUNIDADES_MOCK: Oportunidad[] = [
  { id: 1, tipoCliente: 'empresa', empresaId: 1, empresaNombre: 'Global Tech S.A.S', contactoId: 1, contactoNombre: 'Carlos Mendoza', planLigaTitularId: null, titularNombre: '', servicio: 'Plan Liga Empresarial', responsable: 'María García', valor: '$18.000.000', probabilidad: 75, estado: 'Cotización' },
  { id: 2, tipoCliente: 'empresa', empresaId: 2, empresaNombre: 'Constructora ABC', contactoId: 3, contactoNombre: 'Pedro Sánchez Mejía', planLigaTitularId: null, titularNombre: '', servicio: 'Brigadas de Salud', responsable: 'Carlos Torres', valor: '$5.500.000', probabilidad: 90, estado: 'Negociación' },
  { id: 3, tipoCliente: 'empresa', empresaId: 3, empresaNombre: 'Farmacia Norte', contactoId: 4, contactoNombre: 'Laura Gómez Vargas', planLigaTitularId: null, titularNombre: '', servicio: 'Tamizajes', responsable: 'María García', valor: '$2.200.000', probabilidad: 40, estado: 'Reunión' },
  { id: 4, tipoCliente: 'empresa', empresaId: 4, empresaNombre: 'Estética Mayo', contactoId: 2, contactoNombre: 'Ana Victoria Ruiz', planLigaTitularId: null, titularNombre: '', servicio: 'Plan Liga Empresarial', responsable: 'Juan López', valor: '$12.000.000', probabilidad: 60, estado: 'Primer Contacto' },
  { id: 5, tipoCliente: 'contacto', empresaId: null, empresaNombre: '', contactoId: 5, contactoNombre: 'Roberto Díaz Castro', planLigaTitularId: null, titularNombre: '', servicio: 'Capacitaciones', responsable: 'Juan López', valor: '$3.800.000', probabilidad: 25, estado: 'Lead' },
  { id: 6, tipoCliente: 'empresa', empresaId: 6, empresaNombre: 'Grupo Empresarial XYZ', contactoId: 6, contactoNombre: 'Sandra Morales López', planLigaTitularId: null, titularNombre: '', servicio: 'Plan Liga Empresarial', responsable: 'Carlos Torres', valor: '$22.000.000', probabilidad: 95, estado: 'Ganada' },
  { id: 7, tipoCliente: 'titular', empresaId: null, empresaNombre: '', contactoId: null, contactoNombre: '', planLigaTitularId: 5, titularNombre: 'Roberto Díaz Castro', servicio: 'Programas de Bienestar', responsable: 'María García', valor: '$4.100.000', probabilidad: 10, estado: 'Perdida' },
]

export const OPORTUNIDAD_DRAFT_VACIO: OportunidadDraft = {
  tipoCliente: 'empresa',
  empresaId: null, empresaNombre: '',
  contactoId: null, contactoNombre: '',
  planLigaTitularId: null, titularNombre: '',
  servicio: '', responsable: '',
  valor: '', probabilidad: 50, estado: 'Lead',
}

/** Nombre del cliente de la oportunidad, según el tipo de cliente elegido (empresa, contacto o titular Plan Liga). */
export const clienteLabel = (o: Pick<Oportunidad, 'tipoCliente' | 'empresaNombre' | 'contactoNombre' | 'titularNombre'>): string => {
  if (o.tipoCliente === 'titular') return o.titularNombre
  if (o.tipoCliente === 'contacto') return o.contactoNombre
  return o.empresaNombre
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
