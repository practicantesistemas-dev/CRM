import type { EtapaColor } from '../types/tarjeta'

// Las mismas 7 etapas que usa Oportunidades (y que exige el backend via
// mercadeo_crm_etapas_embudo): el Tablero es una vista Kanban de las mismas oportunidades,
// no un catálogo de etapas propio.
export { ETAPAS } from '@/features/oportunidades/constants/oportunidades.constants'

export const ETAPA_COLOR: Record<string, EtapaColor> = {
  'Lead':            { bg: '#F8FAFC', border: '#E2E8F0', text: '#64748B', dot: '#94A3B8' },
  'Primer Contacto': { bg: '#EEF2FF', border: '#C7D2FE', text: '#2447F9', dot: '#2447F9' },
  'Reunión':         { bg: '#FCE7F3', border: '#FBCFE8', text: '#EC4899', dot: '#EC4899' },
  'Cotización':      { bg: '#FEF9C3', border: '#FDE68A', text: '#C9A227', dot: '#C9A227' },
  'Negociación':     { bg: '#E8EAF6', border: '#C5CAE9', text: '#1A2A6C', dot: '#1A2A6C' },
  'Ganada':          { bg: '#D1FAE5', border: '#A7F3D0', text: '#059669', dot: '#059669' },
  'Perdida':         { bg: '#FEE2E2', border: '#FECACA', text: '#DC2626', dot: '#EF4444' },
}
