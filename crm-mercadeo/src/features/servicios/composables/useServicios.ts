import { ref, computed } from 'vue'
import type { Servicio, ServicioDraft } from '../types/servicio'
import { getServicios, createServicio, updateServicio } from '../services/servicios.api'

export function useServicios() {
  const servicios = ref<Servicio[]>(getServicios())

  const buscar = ref('')
  const filtroEstado = ref('todos')
  const filtroTipo = ref('todos')

  const serviciosFiltrados = computed(() =>
    servicios.value.filter(s => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [s.nombre, s.codigo, s.categoria].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroEstado.value === 'todos' || s.estado === filtroEstado.value)
        && (filtroTipo.value === 'todos' || s.tipo === filtroTipo.value)
    })
  )

  const totalSolicitudes = computed(() => servicios.value.reduce((acc, s) => acc + s.solicitudes, 0))
  const totalVentas = computed(() => servicios.value.reduce((acc, s) => acc + s.ventas, 0))
  const totalEmpresas = computed(() => servicios.value.reduce((acc, s) => acc + s.empresasInteresadas, 0))

  const topServicios = computed(() => [...servicios.value].sort((a, b) => b.solicitudes - a.solicitudes))

  const crearServicio = (data: ServicioDraft) => {
    servicios.value = [createServicio(data), ...servicios.value]
  }

  const actualizarServicio = (id: number, data: ServicioDraft) => {
    const actualizado = updateServicio(id, data)
    if (!actualizado) return
    const idx = servicios.value.findIndex(s => s.id === id)
    if (idx !== -1) servicios.value[idx] = actualizado
  }

  const toggleEstado = (s: Servicio) => {
    const nuevoEstado = s.estado === 'Activo' ? 'Inactivo' : 'Activo'
    const actualizado = updateServicio(s.id, { estado: nuevoEstado })
    if (!actualizado) return
    const idx = servicios.value.findIndex(x => x.id === s.id)
    if (idx !== -1) servicios.value[idx] = actualizado
  }

  return {
    servicios, buscar, filtroEstado, filtroTipo,
    serviciosFiltrados, totalSolicitudes, totalVentas, totalEmpresas, topServicios,
    crearServicio, actualizarServicio, toggleEstado,
  }
}
