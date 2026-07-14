import { onMounted, ref, watch } from 'vue'
import { getDashboardResumen, getKpis } from '../services/dashboard.api'
import { PERIODO_OPTIONS } from '../constants/dashboard.constants'
import type { Kpi } from '../types/dashboard'

export function useDashboard() {
  const periodo = ref('30d')
  const kpis = ref<Kpi[]>([])
  const cargandoKpis = ref(false)
  const errorKpis = ref<string | null>(null)

  const resumen = getDashboardResumen()

  const cargarKpis = async () => {
    cargandoKpis.value = true
    errorKpis.value = null
    try {
      kpis.value = await getKpis(periodo.value)
    } catch (e) {
      errorKpis.value = e instanceof Error ? e.message : 'No se pudo cargar el resumen del tablero.'
    } finally {
      cargandoKpis.value = false
    }
  }

  watch(periodo, cargarKpis)
  onMounted(cargarKpis)

  return {
    periodo, periodoOptions: PERIODO_OPTIONS,
    kpis, cargandoKpis, errorKpis,
    ...resumen,
  }
}
