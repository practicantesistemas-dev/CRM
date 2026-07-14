import {
  Users, Building2, Briefcase, Layers, ClipboardList,
  Phone, Mail, Calendar, FileText, Heart, Target, GitBranch, Megaphone, Zap,
} from 'lucide-vue-next'
import type {
  Kpi, AccesoRapido, PeriodoOption,
  TableroResumenResponse, DistribucionContactosResponse,
} from '../types/dashboard'

// Metadata visual de cada KPI del tablero. El valor numérico llega de
// GET /api/tablero/resumen y se combina con esto en dashboard.api.ts.
export const KPI_META: Record<keyof TableroResumenResponse, Omit<Kpi, 'valor'>> = {
  contactos:     { label: 'Contactos',     delta: '', positivo: true, icono: Users,     color: '#2447F9', bg: '#EEF2FF', subtexto: 'total'              },
  titulares_pl:  { label: 'Titulares PL',  delta: '', positivo: true, icono: Heart,     color: '#EC4899', bg: '#FCE7F3', subtexto: 'Plan Liga activos'  },
  empresas:      { label: 'Empresas',      delta: '', positivo: true, icono: Building2, color: '#1A2A6C', bg: '#E8EAF6', subtexto: 'vinculadas'         },
  oportunidades: { label: 'Oportunidades', delta: '', positivo: true, icono: Briefcase, color: '#EC4899', bg: '#FCE7F3', subtexto: 'en curso'           },
  servicios:     { label: 'Servicios',     delta: '', positivo: true, icono: Layers,       color: '#C9A227', bg: '#FEF9C3', subtexto: 'Plan Liga activos'  },
  seguimientos:  { label: 'Seguimientos',  delta: '', positivo: true, icono: ClipboardList, color: '#059669', bg: '#D1FAE5', subtexto: 'pendientes'        },
}

// Ícono/color por tipo de actividad devuelto por GET /api/tablero/actividad-reciente.
// Se indexa por texto normalizado (sin tildes, minúsculas) porque el backend
// no expone un enum fijo para "tipo" (ej. llega "Reunion" sin tilde).
export const TIPO_ACTIVIDAD_META: Record<string, { icono: unknown; color: string; bg: string }> = {
  llamada: { icono: Phone,    color: '#2447F9', bg: '#EEF2FF' },
  correo:  { icono: Mail,     color: '#EC4899', bg: '#FCE7F3' },
  reunion: { icono: Calendar, color: '#C9A227', bg: '#FEF9C3' },
  nota:    { icono: FileText, color: '#059669', bg: '#D1FAE5' },
}
export const TIPO_ACTIVIDAD_DEFAULT = { icono: FileText, color: '#64748B', bg: '#F1F5F9' }

// Label/color por categoría de GET /api/tablero/distribucion-contactos.
export const DISTRIBUCION_META: Record<keyof Omit<DistribucionContactosResponse, 'total'>, { label: string; color: string }> = {
  clientes_activos:   { label: 'Clientes activos',   color: '#2447F9' },
  prospectos_activos: { label: 'Prospectos activos', color: '#C9A227' },
  inactivos:          { label: 'Inactivos',          color: '#EC4899' },
}

// Colores asignados por posición de etapa (las etapas de un embudo son
// configurables, no hay un set fijo de nombres para mapear por clave).
export const EMBUDO_COLORES = ['#94A3B8', '#2447F9', '#C9A227', '#1A2A6C', '#059669', '#EC4899', '#0EA5E9', '#F97316']

export const ACCESOS_RAPIDOS_MOCK: AccesoRapido[] = [
  { label: 'Titulares y Beneficiarios', ruta: 'plan-liga',       icono: Heart,        color: '#EC4899', bg: '#FCE7F3' },
  { label: 'Oportunidades',             ruta: 'oportunidades',   icono: Target,       color: '#2447F9', bg: '#EEF2FF' },
  { label: 'Tablero',                   ruta: 'embudos',         icono: GitBranch,    color: '#1A2A6C', bg: '#E8EAF6' },
  { label: 'Campañas Masivas',          ruta: 'campanas',        icono: Megaphone,    color: '#C9A227', bg: '#FEF9C3' },
  { label: 'Bitácora',                  ruta: 'relacionamiento', icono: ClipboardList,color: '#059669', bg: '#D1FAE5' },
  { label: 'Automatizaciones',          ruta: 'automatizaciones',icono: Zap,          color: '#EC4899', bg: '#FCE7F3' },
]

export const PERIODO_OPTIONS: PeriodoOption[] = [
  { value: '7d',        label: 'Últimos 7 días' },
  { value: '30d',       label: 'Últimos 30 días' },
  { value: 'trimestre', label: 'Este trimestre' },
  { value: 'anio',      label: 'Este año' },
  { value: 'todo',      label: 'Todo' },
]
