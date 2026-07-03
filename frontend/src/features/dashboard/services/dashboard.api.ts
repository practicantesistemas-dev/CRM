import {
  KPIS_MOCK, ACTIVIDADES_MOCK, DISTRIBUCION_MOCK,
  TOP_SERVICIOS_MOCK, EMBUDO_RESUMEN_MOCK, ACCESOS_RAPIDOS_MOCK,
} from '../constants/dashboard.constants'

export function getDashboardResumen() {
  return {
    kpis: KPIS_MOCK,
    actividades: ACTIVIDADES_MOCK,
    distribucion: DISTRIBUCION_MOCK,
    topServicios: TOP_SERVICIOS_MOCK,
    embudoResumen: EMBUDO_RESUMEN_MOCK,
    accesosRapidos: ACCESOS_RAPIDOS_MOCK,
  }
}
