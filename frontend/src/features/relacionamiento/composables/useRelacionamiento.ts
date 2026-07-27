import { ref, computed, onMounted } from 'vue'
import type { Actividad, ActividadDraft, TipoActividad } from '../types/actividad'
import { getActividades, createActividad } from '../services/relacionamiento.api'

export function useRelacionamiento() {
  const actividades = ref<Actividad[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const cargarActividades = async () => {
    cargando.value = true
    error.value = null
    try {
      actividades.value = await getActividades()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'No se pudo cargar la bitácora.'
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargarActividades)

  const filtroTipo = ref<TipoActividad | 'todos'>('todos')
  const filtroUsuario = ref('todos')
  const buscar = ref('')

  const actividadesFiltradas = computed(() =>
    actividades.value.filter(a => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [a.contactoNombre, a.empresaNombre, a.titularNombre, a.accion].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroTipo.value === 'todos' || a.tipo === filtroTipo.value)
        && (filtroUsuario.value === 'todos' || a.usuario === filtroUsuario.value)
    })
  )

  const usuarios = computed(() => [...new Set(actividades.value.map(a => a.usuario).filter(Boolean))].sort())

  const guardandoActividad = ref(false)
  const errorGuardarActividad = ref<string | null>(null)

  const crearActividad = async (data: ActividadDraft): Promise<boolean> => {
    guardandoActividad.value = true
    errorGuardarActividad.value = null
    try {
      await createActividad(data)
      await cargarActividades()
      return true
    } catch (e) {
      errorGuardarActividad.value = e instanceof Error ? e.message : 'No se pudo registrar la actividad.'
      return false
    } finally {
      guardandoActividad.value = false
    }
  }

  return {
    actividades, cargando, error,
    filtroTipo, filtroUsuario, buscar,
    actividadesFiltradas, usuarios,
    crearActividad, guardandoActividad, errorGuardarActividad,
  }
}
