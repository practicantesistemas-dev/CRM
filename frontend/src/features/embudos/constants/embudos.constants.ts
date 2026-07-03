import type { EtapaColor, Tarjeta, TarjetaDraft } from '../types/tarjeta'

export const ETAPAS = ['Lead', 'Primer Contacto', 'Reunión', 'Cotización', 'Negociación', 'Ganado']

export const ETAPA_COLOR: Record<string, EtapaColor> = {
  'Lead':            { bg: '#F8FAFC', border: '#E2E8F0', text: '#64748B', dot: '#94A3B8' },
  'Primer Contacto': { bg: '#EEF2FF', border: '#C7D2FE', text: '#2447F9', dot: '#2447F9' },
  'Reunión':         { bg: '#FCE7F3', border: '#FBCFE8', text: '#EC4899', dot: '#EC4899' },
  'Cotización':      { bg: '#FEF9C3', border: '#FDE68A', text: '#C9A227', dot: '#C9A227' },
  'Negociación':     { bg: '#E8EAF6', border: '#C5CAE9', text: '#1A2A6C', dot: '#1A2A6C' },
  'Ganado':          { bg: '#D1FAE5', border: '#A7F3D0', text: '#059669', dot: '#059669' },
}

export const TARJETAS_MOCK: Tarjeta[] = [
  { id: 1, empresa: 'Tech Solutions',    contacto: 'Roberto Díaz',    valor: '$3.800.000',  responsable: 'Juan López',    seguimiento: '2026-07-05', etapa: 'Lead'            },
  { id: 2, empresa: 'Estética Mayo',     contacto: 'Ana Ruiz',        valor: '$12.000.000', responsable: 'Juan López',    seguimiento: '2026-07-03', etapa: 'Primer Contacto' },
  { id: 3, empresa: 'Grupo XYZ',         contacto: 'Sandra Morales',  valor: '$8.500.000',  responsable: 'Carlos Torres', seguimiento: '2026-07-02', etapa: 'Primer Contacto' },
  { id: 4, empresa: 'Farmacia Norte',    contacto: 'Laura Gómez',     valor: '$2.200.000',  responsable: 'María García',  seguimiento: '2026-07-04', etapa: 'Reunión'         },
  { id: 5, empresa: 'Innova Group',      contacto: 'Valentina Cruz',  valor: '$9.000.000',  responsable: 'Carlos Torres', seguimiento: '2026-07-01', etapa: 'Cotización'      },
  { id: 6, empresa: 'Global Tech',       contacto: 'Carlos Mendoza',  valor: '$18.000.000', responsable: 'María García',  seguimiento: '2026-07-06', etapa: 'Cotización'      },
  { id: 7, empresa: 'Constructora ABC',  contacto: 'Pedro Sánchez',   valor: '$5.500.000',  responsable: 'Carlos Torres', seguimiento: '2026-06-30', etapa: 'Negociación'     },
  { id: 8, empresa: 'SalvaTech',         contacto: 'Jorge Ramírez',   valor: '$22.000.000', responsable: 'María García',  seguimiento: '2026-07-08', etapa: 'Ganado'          },
]

export const TARJETA_DRAFT_VACIO: TarjetaDraft = {
  empresa: '', contacto: '', valor: '', responsable: '', seguimiento: '', etapa: '',
}
