import { onMounted, ref, watch } from 'vue'
import {
  getDashboardResumen, getKpis, getActividadReciente, getDistribucionContactos, getTopPlanes,
  getEmbudoComercial,
} from '../services/dashboard.api'
import { PERIODO_OPTIONS } from '../constants/dashboard.constants'
import type { Kpi, ActividadReciente, DistribucionItem, PlanTop, EmbudoEtapa } from '../types/dashboard'

export function useDashboard() {
  const periodo = ref('30d')

  const kpis = ref<Kpi[]>([])
  const cargandoKpis = ref(false)
  const errorKpis = ref<string | null>(null)

  const distribucion = ref<DistribucionItem[]>([])
  const errorDistribucion = ref<string | null>(null)

  const actividades = ref<ActividadReciente[]>([])
  const errorActividades = ref<string | null>(null)

  const topPlanes = ref<PlanTop[]>([])
  const errorTopPlanes = ref<string | null>(null)

  const embudoResumen = ref<EmbudoEtapa[]>([])
  const errorEmbudo = ref<string | null>(null)

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

  const cargarDistribucion = async () => {
    errorDistribucion.value = null
    try {
      distribucion.value = await getDistribucionContactos(periodo.value)
    } catch (e) {
      errorDistribucion.value = e instanceof Error ? e.message : 'No se pudo cargar la distribución de contactos.'
    }
  }

  const cargarActividades = async () => {
    errorActividades.value = null
    try {
      actividades.value = await getActividadReciente(6)
    } catch (e) {
      errorActividades.value = e instanceof Error ? e.message : 'No se pudo cargar la actividad reciente.'
    }
  }

  const cargarTopPlanes = async () => {
    errorTopPlanes.value = null
    try {
      topPlanes.value = await getTopPlanes(3)
    } catch (e) {
      errorTopPlanes.value = e instanceof Error ? e.message : 'No se pudo cargar el top de planes.'
    }
  }

  const cargarEmbudo = async () => {
    errorEmbudo.value = null
    try {
      embudoResumen.value = await getEmbudoComercial(periodo.value)
    } catch (e) {
      errorEmbudo.value = e instanceof Error ? e.message : 'No se pudo cargar el embudo comercial.'
    }
  }

  watch(periodo, () => {
    cargarKpis()
    cargarDistribucion()
    cargarEmbudo()
  })

  onMounted(() => {
    cargarKpis()
    cargarDistribucion()
    cargarActividades()
    cargarTopPlanes()
    cargarEmbudo()
  })

  return {
    periodo, periodoOptions: PERIODO_OPTIONS,
    kpis, cargandoKpis, errorKpis,
    distribucion, errorDistribucion,
    actividades, errorActividades,
    topPlanes, errorTopPlanes,
    embudoResumen, errorEmbudo,
    ...resumen,
  }
}