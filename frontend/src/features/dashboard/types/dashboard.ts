export interface Kpi {
  label: string
  valor: string
  delta: string
  positivo: boolean
  icono: unknown
  color: string
  bg: string
  subtexto: string
}

export interface ActividadReciente {
  tipo: string
  icono: unknown
  contacto: string
  empresa: string
  fechaHora: string
  usuario: string
  color: string
  bg: string
  /** Nota/comentario registrado en la actividad (descripcion de la bitácora). */
  descripcion: string
}

export interface DistribucionItem {
  label: string
  cantidad: number
  porcentaje: number
  color: string
}

export interface PlanTop {
  /** null representa el grupo "Plan Estándar" (titulares sin tipo_plan_id asignado). */
  planId: number | null
  nombre: string
  solicitudes: number
  conversion: string
}

export interface EmbudoEtapa {
  etapa: string
  count: number
  color: string
}

export interface AccesoRapido {
  label: string
  ruta: string
  icono: unknown
  color: string
  bg: string
}

export interface PeriodoOption {
  value: string
  label: string
}

export interface TableroResumenResponse {
  contactos: { valor: number }
  titulares_pl: { valor: number }
  empresas: { valor: number }
  oportunidades: { valor: number }
  servicios: { valor: number }
  seguimientos: { valor: number }
}

export interface ActividadRecienteResponse {
  id: number
  tipo: string | null
  descripcion: string | null
  proximo_paso: string | null
  fecha: string | null
  contacto_id: number | null
  contacto_nombre: string | null
  nombre_empresa: string | null
  titular_id: number | null
  titular_nombre: string | null
  usuario_id: number | null
  usuario_nombre: string | null
}

export interface DistribucionContactosResponse {
  total: number
  clientes_activos: { cantidad: number; porcentaje: number }
  prospectos_activos: { cantidad: number; porcentaje: number }
  inactivos: { cantidad: number; porcentaje: number }
}

export interface TopPlanResponse {
  plan_id: number | null
  nombre: string
  solicitudes: number
  porcentaje: number
}

export interface EmbudoComercialItem {
  etapa_id: number
  embudo_id: number
  nombre: string
  orden: number
  cantidad: number
}
