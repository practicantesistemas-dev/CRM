import { ref } from 'vue'
import { getDashboardResumen } from '../services/dashboard.api'
import { PERIODO_OPTIONS } from '../constants/dashboard.constants'

export function useDashboard() {
  const periodo = ref('30d')
  const resumen = getDashboardResumen()

  return { periodo, periodoOptions: PERIODO_OPTIONS, ...resumen }
}
