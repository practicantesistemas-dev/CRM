import { computed, reactive, ref, watch } from 'vue'
import {
  clonarFiltro, contarFiltros, filtroVacio,
  type FiltroSegmento,
} from '../constants/ciclo-afiliado.constants'
import { getAudiencias, type PersonaAudiencia } from '../services/segmentos.api'

const f = reactive<FiltroSegmento>(filtroVacio())
const fApp = ref<FiltroSegmento>(filtroVacio())
const resultados = ref<PersonaAudiencia[]>([])
const total = ref(0)
const cargando = ref(false)
const error = ref<string | null>(null)
const sel = ref<Set<string>>(new Set())
let peticionId = 0

watch(resultados, (lista) => {
  sel.value = new Set(lista.map(a => a.id))
})

export function useSegmentador() {
  const filtrados = computed(() => resultados.value)
  const seleccion = computed(() => filtrados.value.filter(a => sel.value.has(a.id)))
  const todoSel = computed(() => filtrados.value.length > 0 && filtrados.value.every(a => sel.value.has(a.id)))
  const nFiltros = computed(() => contarFiltros(fApp.value))

  const aplicar = async () => {
    fApp.value = clonarFiltro(f)
    const id = ++peticionId
    cargando.value = true
    error.value = null
    try {
      const data = await getAudiencias(fApp.value)
      if (id !== peticionId) return
      resultados.value = data.items
      total.value = data.total
    } catch (e) {
      if (id !== peticionId) return
      resultados.value = []
      total.value = 0
      error.value = e instanceof Error ? e.message : 'No se pudo cargar la audiencia.'
    } finally {
      if (id === peticionId) cargando.value = false
    }
  }

  const limpiar = () => {
    Object.assign(f, filtroVacio())
    fApp.value = filtroVacio()
    resultados.value = []
    total.value = 0
    error.value = null
    sel.value = new Set()
  }

  const precargar = async (pre: Partial<FiltroSegmento>) => {
    Object.assign(f, filtroVacio(), pre)
    await aplicar()
  }

  const toggleRow = (id: string) => {
    sel.value.has(id) ? sel.value.delete(id) : sel.value.add(id)
    sel.value = new Set(sel.value)
  }
  const toggleTodo = () => {
    sel.value = todoSel.value ? new Set() : new Set(filtrados.value.map(a => a.id))
  }

  return {
    f, fApp, sel, filtrados, seleccion, todoSel, nFiltros,
    total, cargando, error,
    aplicar, limpiar, precargar, toggleRow, toggleTodo,
  }
}
