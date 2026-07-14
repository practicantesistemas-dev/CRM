import {
  ACTIVIDADES_MOCK, DISTRIBUCION_MOCK,
  TOP_SERVICIOS_MOCK, EMBUDO_RESUMEN_MOCK, ACCESOS_RAPIDOS_MOCK, KPI_META,
} from '../constants/dashboard.constants'
import type { Kpi, TableroResumenResponse } from '../types/dashboard'

const API_URL = import.meta.env.VITE_CRM_API_URL

export async function getKpis(periodo: string): Promise<Kpi[]> {
  const response = await fetch(`${API_URL}/api/tablero/resumen?periodo=${periodo}`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el resumen del tablero.')
  }

  const data: TableroResumenResponse = await response.json()

  return (Object.keys(KPI_META) as (keyof TableroResumenResponse)[]).map((key) => ({
    ...KPI_META[key],
    valor: String(data[key]?.valor ?? 0),
  }))
}

export function getDashboardResumen() {
  return {
    actividades: ACTIVIDADES_MOCK,
    distribucion: DISTRIBUCION_MOCK,
    topServicios: TOP_SERVICIOS_MOCK,
    embudoResumen: EMBUDO_RESUMEN_MOCK,
    accesosRapidos: ACCESOS_RAPIDOS_MOCK,
  }
}
