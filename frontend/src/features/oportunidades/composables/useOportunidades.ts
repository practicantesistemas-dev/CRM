import { ref, computed, onMounted } from 'vue'
import type { EtapaOportunidad, Oportunidad, OportunidadDraft } from '../types/oportunidad'
import { getOportunidades, createOportunidad, updateOportunidad } from '../services/oportunidades.api'

export function useOportunidades() {
  const oportunidades = ref<Oportunidad[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargarOportunidades = async () => {
    cargando.value = true
    error.value = null
    try {
      oportunidades.value = await getOportunidades()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de oportunidades.'
    } finally {
      cargando.value = false
    }
  }
  onMounted(cargarOportunidades)

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

  const guardando = ref(false)
  const errorGuardar = ref<string | null>(null)

  const crearOportunidad = async (data: OportunidadDraft): Promise<boolean> => {
    guardando.value = true
    errorGuardar.value = null
    try {
      const nueva = await createOportunidad(data)
      oportunidades.value = [nueva, ...oportunidades.value]
      return true
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo crear la oportunidad.'
      return false
    } finally {
      guardando.value = false
    }
  }

  const actualizarOportunidad = async (id: number, data: OportunidadDraft): Promise<boolean> => {
    guardando.value = true
    errorGuardar.value = null
    try {
      const actualizada = await updateOportunidad(id, data)
      const idx = oportunidades.value.findIndex(o => o.id === id)
      if (idx !== -1) oportunidades.value[idx] = actualizada
      return true
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo actualizar la oportunidad.'
      return false
    } finally {
      guardando.value = false
    }
  }

  // Cambia solo la etapa (sin tocar probabilidad): la usa el Tablero (Kanban) al arrastrar
  // una tarjeta a otra columna.
  const cambiarEtapa = async (o: Oportunidad, etapa: EtapaOportunidad) => {
    try {
      const actualizada = await updateOportunidad(o.id, { estado: etapa })
      const idx = oportunidades.value.findIndex(x => x.id === o.id)
      if (idx !== -1) oportunidades.value[idx] = actualizada
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo cambiar la etapa de la oportunidad.'
    }
  }

  const marcarGanada = async (o: Oportunidad) => {
    try {
      const actualizada = await updateOportunidad(o.id, { estado: 'Ganada', probabilidad: 100 })
      const idx = oportunidades.value.findIndex(x => x.id === o.id)
      if (idx !== -1) oportunidades.value[idx] = actualizada
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo marcar la oportunidad como ganada.'
    }
  }

  const marcarPerdida = async (o: Oportunidad) => {
    try {
      const actualizada = await updateOportunidad(o.id, { estado: 'Perdida', probabilidad: 0 })
      const idx = oportunidades.value.findIndex(x => x.id === o.id)
      if (idx !== -1) oportunidades.value[idx] = actualizada
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo marcar la oportunidad como perdida.'
    }
  }

  return {
    oportunidades, cargando, error, buscar, filtroEstado, filtroResponsable,
    oportunidadesFiltradas, responsables, valorTotal,
    crearOportunidad, actualizarOportunidad, cambiarEtapa, marcarGanada, marcarPerdida,
    guardando, errorGuardar,
  }
}
