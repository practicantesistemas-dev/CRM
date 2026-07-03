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
  icono: unknown
  color: string
  bg: string
}

export interface PeriodoOption {
  value: string
  label: string
}
