import { ref, computed } from 'vue'
import type { Oportunidad, OportunidadDraft } from '../types/oportunidad'
import { getOportunidades, createOportunidad, updateOportunidad } from '../services/oportunidades.api'

export function useOportunidades() {
  const oportunidades = ref<Oportunidad[]>(getOportunidades())

  const buscar = ref('')
  const filtroEstado = ref('todos')
  const filtroResponsable = ref('todos')

  const oportunidadesFiltradas = computed(() =>
    oportunidades.value.filter(o => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [o.empresaNombre, o.contactoNombre, o.titularNombre, o.servicio].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroEstado.value === 'todos' || o.estado === filtroEstado.value)
        && (filtroResponsable.value === 'todos' || o.responsable === filtroResponsable.value)
    })
  )

  const responsables = computed(() => [...new Set(oportunidades.value.map(o => o.responsable))].sort())

  const valorTotal = computed(() => {
    const activas = oportunidades.value.filter(o => !['Ganada', 'Perdida'].includes(o.estado))
    return activas.length + ' activas'
  })

  const crearOportunidad = (data: OportunidadDraft) => {
    oportunidades.value = [createOportunidad(data), ...oportunidades.value]
  }

  const actualizarOportunidad = (id: number, data: OportunidadDraft) => {
    const actualizada = updateOportunidad(id, data)
    if (!actualizada) return
    const idx = oportunidades.value.findIndex(o => o.id === id)
    if (idx !== -1) oportunidades.value[idx] = actualizada
  }

  const marcarGanada = (o: Oportunidad) => {
    const actualizada = updateOportunidad(o.id, { estado: 'Ganada', probabilidad: 100 })
    if (!actualizada) return
    const idx = oportunidades.value.findIndex(x => x.id === o.id)
    if (idx !== -1) oportunidades.value[idx] = actualizada
  }

  const marcarPerdida = (o: Oportunidad) => {
    const actualizada = updateOportunidad(o.id, { estado: 'Perdida', probabilidad: 0 })
    if (!actualizada) return
    const idx = oportunidades.value.findIndex(x => x.id === o.id)
    if (idx !== -1) oportunidades.value[idx] = actualizada
  }

  return {
    oportunidades, buscar, filtroEstado, filtroResponsable,
    oportunidadesFiltradas, responsables, valorTotal,
    crearOportunidad, actualizarOportunidad, marcarGanada, marcarPerdida,
  }
}
