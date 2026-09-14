import { computed, reactive, ref, watch } from 'vue'
import {
  AFILIADOS_MOCK, afiliadoCoincide, clonarFiltro, contarFiltros, filtroVacio,
  type FiltroSegmento,
} from '../constants/ciclo-afiliado.constants'

// Estado del segmentador guardado a nivel de MÓDULO (una sola instancia para
// toda la app). Así sobrevive a cambiar de pestaña o volver al hub —la vista se
// destruye y se vuelve a crear, o el <keep-alive> la expulsa de la caché— pero
// se reinicia al recargar la página. El usuario no pierde sus filtros ni su
// selección solo por navegar; solo cambian cuando hace una acción (aplicar,
// limpiar, marcar/desmarcar) o cuando recarga.
const f = reactive<FiltroSegmento>(filtroVacio())         // filtro que se está editando
const fApp = ref<FiltroSegmento>(filtroVacio())           // filtro aplicado (el que filtra la tabla)
const sel = ref<Set<number>>(new Set(AFILIADOS_MOCK.map(a => a.id)))

const idsQueCoinciden = (filtro: FiltroSegmento) =>
  AFILIADOS_MOCK.filter(x => afiliadoCoincide(x, filtro)).map(a => a.id)

// Cuando cambia el filtro APLICADO (aplicar / limpiar / precargar reasignan
// fApp) se re-selecciona todo el resultado nuevo. Navegar NO toca fApp, así que
// lo que el usuario marcó/desmarcó se conserva.
watch(fApp, () => { sel.value = new Set(idsQueCoinciden(fApp.value)) })

export function useSegmentador() {
  const filtrados = computed(() => AFILIADOS_MOCK.filter(x => afiliadoCoincide(x, fApp.value)))
  const seleccion = computed(() => filtrados.value.filter(a => sel.value.has(a.id)))
  const todoSel = computed(() => filtrados.value.length > 0 && filtrados.value.every(a => sel.value.has(a.id)))
  const nFiltros = computed(() => contarFiltros(fApp.value))

  const aplicar = () => { fApp.value = clonarFiltro(f) }
  const limpiar = () => { Object.assign(f, filtroVacio()); fApp.value = filtroVacio() }
  // Carga los criterios de un "Segmento guardado" y los deja aplicados.
  const precargar = (pre: Partial<FiltroSegmento>) => {
    Object.assign(f, filtroVacio(), pre)
    fApp.value = clonarFiltro(f)
  }

  const toggleRow = (id: number) => {
    sel.value.has(id) ? sel.value.delete(id) : sel.value.add(id)
    sel.value = new Set(sel.value)
  }
  const toggleTodo = () => {
    sel.value = todoSel.value ? new Set() : new Set(filtrados.value.map(a => a.id))
  }

  return { f, fApp, sel, filtrados, seleccion, todoSel, nFiltros, aplicar, limpiar, precargar, toggleRow, toggleTodo }
}
