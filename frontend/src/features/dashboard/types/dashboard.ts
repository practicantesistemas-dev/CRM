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
  hace: string
  usuario: string
  color: string
  bg: string
}

export interface DistribucionItem {
  label: string
  cantidad: number
  porcentaje: number
  color: string
}

export interface ServicioTop {
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
  empresa_id: number | null
  empresa_nombre: string | null
  usuario_id: number | null
  usuario_nombre: string | null
}

export interface DistribucionContactosResponse {
  total: number
  clientes_activos: { cantidad: number; porcentaje: number }
  prospectos_activos: { cantidad: number; porcentaje: number }
  inactivos: { cantidad: number; porcentaje: number }
}

export interface TopServicioResponse {
  servicio_id: number
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
