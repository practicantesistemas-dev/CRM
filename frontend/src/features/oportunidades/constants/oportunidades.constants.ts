import { Building2, User, Award } from 'lucide-vue-next'
import type { EtapaOportunidad, Oportunidad, OportunidadDraft, TipoCliente } from '../types/oportunidad'

export const ETAPAS: EtapaOportunidad[] = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganada', 'Perdida']

export const TIPOS_CLIENTE: { value: TipoCliente; label: string; icono: unknown }[] = [
  { value: 'empresa', label: 'Empresa', icono: Building2 },
  { value: 'contacto', label: 'Contacto', icono: User },
  { value: 'titular', label: 'Titular Plan Liga', icono: Award },
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
    'Lead':           'text-slate-400 dark:text-slate-500',
    'Primer Contacto':'text-[#1E3A8A] dark:text-blue-300',
    'Reunión':        'text-[#9D174D] dark:text-pink-300',
    'Cotización':     'text-amber-600 dark:text-amber-400',
    'Negociación':    'text-[#1A2A6C] dark:text-indigo-300',
    'Ganada':         'text-emerald-600 dark:text-emerald-400',
    'Perdida':        'text-red-500 dark:text-red-400',
  }
  return map[e] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
}
