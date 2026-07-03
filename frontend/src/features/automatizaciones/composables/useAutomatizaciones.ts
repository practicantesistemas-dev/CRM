import { ref, computed } from 'vue'
import type { Automatizacion, AutomatizacionDraft } from '../types/automatizacion'
import {
  getAutomatizaciones, createAutomatizacion, updateAutomatizacion, deleteAutomatizacion,
} from '../services/automatizaciones.api'

export function useAutomatizaciones() {
  const automatizaciones = ref<Automatizacion[]>(getAutomatizaciones())

  const buscar = ref('')
  const filtroEstado = ref('todos')

  const filtradas = computed(() =>
    automatizaciones.value.filter(a => {
      const q = buscar.value.toLowerCase()
      const matchQ = !q || [a.nombre, a.descripcion, a.trigger, a.accion]
        .some(f => f.toLowerCase().includes(q))
      return matchQ && (filtroEstado.value === 'todos' || a.estado === filtroEstado.value)
    })
  )

  const totalActivas = computed(() => automatizaciones.value.filter(a => a.estado === 'Activa').length)
  const totalEjecuciones = computed(() => automatizaciones.value.reduce((s, a) => s + a.ejecuciones, 0))
  const totalError = computed(() => automatizaciones.value.filter(a => a.estado === 'Error').length)

  const sync = (id: number, data: Partial<Automatizacion>) => {
    const actualizada = updateAutomatizacion(id, data)
    if (!actualizada) return
    const idx = automatizaciones.value.findIndex(a => a.id === id)
    if (idx !== -1) automatizaciones.value[idx] = actualizada
  }

  const toggleActivo = (a: Automatizacion) => {
    const activo = !a.activo
    sync(a.id, { activo, estado: a.estado === 'Error' ? a.estado : (activo ? 'Activa' : 'Pausada') })
  }

  const eliminar = (id: number) => {
    deleteAutomatizacion(id)
    automatizaciones.value = automatizaciones.value.filter(a => a.id !== id)
  }

  const crearAutomatizacion = (data: AutomatizacionDraft) => {
    automatizaciones.value = [createAutomatizacion(data), ...automatizaciones.value]
  }

  const actualizarAutomatizacion = (id: number, data: AutomatizacionDraft) => {
    sync(id, data)
  }

  return {
    automatizaciones, buscar, filtroEstado,
    filtradas, totalActivas, totalEjecuciones, totalError,
    toggleActivo, eliminar, crearAutomatizacion, actualizarAutomatizacion,
  }
}
