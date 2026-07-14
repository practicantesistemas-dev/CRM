import {
  Users, Building2, Briefcase, Layers, ClipboardList,
  Phone, Mail, Calendar, FileText, Heart, Target, GitBranch, Megaphone, Zap,
} from 'lucide-vue-next'
import type {
  Kpi, ActividadReciente, DistribucionItem, ServicioTop, EmbudoEtapa, AccesoRapido, PeriodoOption,
  TableroResumenResponse,
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

export const ACTIVIDADES_MOCK: ActividadReciente[] = [
  { tipo: 'Llamada', icono: Phone,    contacto: 'Carlos Mendoza',    empresa: 'Global Tech S.A.S',    hace: 'Hace 15 min', usuario: 'María García',  color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',  icono: Mail,     contacto: 'Ana Victoria Ruiz', empresa: 'Estética Mayo',         hace: 'Hace 1h',     usuario: 'Juan López',    color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Reunión', icono: Calendar, contacto: 'Pedro Sánchez',     empresa: 'Constructora ABC',      hace: 'Hace 2h',     usuario: 'Carlos Torres', color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Nota',    icono: FileText, contacto: 'Laura Gómez',       empresa: 'Farmacia Norte',        hace: 'Hace 3h',     usuario: 'María García',  color: '#059669', bg: '#D1FAE5' },
  { tipo: 'Llamada', icono: Phone,    contacto: 'Roberto Díaz',      empresa: 'Tech Solutions',        hace: 'Hace 5h',     usuario: 'Juan López',    color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',  icono: Mail,     contacto: 'Sandra Morales',    empresa: 'Grupo Empresarial XYZ', hace: 'Hace 6h',     usuario: 'Carlos Torres', color: '#EC4899', bg: '#FCE7F3' },
]

export const DISTRIBUCION_MOCK: DistribucionItem[] = [
  { label: 'Activos',    porcentaje: 68, color: '#2447F9' },
  { label: 'En proceso', porcentaje: 22, color: '#C9A227' },
  { label: 'Inactivos',  porcentaje: 10, color: '#EC4899' },
]

export const TOP_SERVICIOS_MOCK: ServicioTop[] = [
  { nombre: 'Plan Liga Empresarial', solicitudes: 312, conversion: '42%' },
  { nombre: 'Plan Liga Individual',  solicitudes: 245, conversion: '35%' },
  { nombre: 'Brigadas de Salud',     solicitudes: 187, conversion: '28%' },
  { nombre: 'Tamizajes',             solicitudes: 134, conversion: '31%' },
]

export const EMBUDO_RESUMEN_MOCK: EmbudoEtapa[] = [
  { etapa: 'Lead',            count: 12, color: '#94A3B8' },
  { etapa: 'Primer Contacto', count: 8,  color: '#2447F9' },
  { etapa: 'Cotización',      count: 5,  color: '#C9A227' },
  { etapa: 'Negociación',     count: 3,  color: '#1A2A6C' },
  { etapa: 'Ganado',          count: 6,  color: '#059669' },
]

export const ACCESOS_RAPIDOS_MOCK: AccesoRapido[] = [
  { label: 'Plan Liga',      icono: Heart,        color: '#EC4899', bg: '#FCE7F3' },
  { label: 'Oportunidades',  icono: Target,       color: '#2447F9', bg: '#EEF2FF' },
  { label: 'Embudos',        icono: GitBranch,    color: '#1A2A6C', bg: '#E8EAF6' },
  { label: 'Campañas',       icono: Megaphone,    color: '#C9A227', bg: '#FEF9C3' },
  { label: 'Bitácora',       icono: ClipboardList,color: '#059669', bg: '#D1FAE5' },
  { label: 'Automatización', icono: Zap,          color: '#EC4899', bg: '#FCE7F3' },
]

export const PERIODO_OPTIONS: PeriodoOption[] = [
  { value: '7d',        label: 'Últimos 7 días' },
  { value: '30d',       label: 'Últimos 30 días' },
  { value: 'trimestre', label: 'Este trimestre' },
  { value: 'anio',      label: 'Este año' },
  { value: 'todo',      label: 'Todo' },
]
