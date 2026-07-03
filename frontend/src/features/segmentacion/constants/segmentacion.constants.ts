import type { FiltrosSegmento, Segmento } from '../types/segmento'

export const SEGMENTOS_MOCK: Segmento[] = [
  { id: 1, nombre: 'Empresas VIP Pereira', empresa: 'todas', servicio: 'Plan Liga Empresarial', estado: 'Activo', etiqueta: 'VIP', ciudad: 'Pereira', responsable: 'todos', total: 34, creadoEn: '2026-06-01' },
  { id: 2, nombre: 'Prospectos sin gestión', empresa: 'todas', servicio: 'todos', estado: 'Prospecto', etiqueta: 'todos', ciudad: 'todas', responsable: 'María García', total: 67, creadoEn: '2026-05-20' },
  { id: 3, nombre: 'Brigadas Medellín Q3', empresa: 'todas', servicio: 'Brigadas de Salud', estado: 'todos', etiqueta: 'todos', ciudad: 'Medellín', responsable: 'Carlos Torres', total: 22, creadoEn: '2026-06-15' },
]

export const FILTROS_VACIOS: FiltrosSegmento = {
  empresa: '',
  servicio: 'todos',
  estado: 'todos',
  etiqueta: 'todos',
  ciudad: 'todas',
  responsable: 'todos',
}

export const SERVICIOS_OPTIONS = ['Plan Liga Empresarial', 'Plan Liga Individual', 'Tamizajes', 'Brigadas de Salud', 'Capacitaciones', 'Programas de Bienestar']
export const ESTADOS_OPTIONS = ['Activo', 'Inactivo', 'Prospecto', 'En proceso']
export const ETIQUETAS_OPTIONS = ['VIP', 'Plan Liga', 'Interesado', 'Empresarial', 'Nuevo']
export const CIUDADES_OPTIONS = ['Pereira', 'Bogotá', 'Medellín', 'Cali', 'Manizales', 'Barranquilla']
export const RESPONSABLES_OPTIONS = ['María García', 'Juan López', 'Carlos Torres']
