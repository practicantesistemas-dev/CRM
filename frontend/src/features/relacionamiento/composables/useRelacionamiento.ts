import { ref, computed } from 'vue'
import type { Actividad, ActividadDraft, TipoActividad } from '../types/actividad'
import { getActividades, createActividad } from '../services/relacionamiento.api'

export function useRelacionamiento() {
  const actividades = ref<Actividad[]>(getActividades())

  const filtroTipo = ref<TipoActividad | 'todos'>('todos')
  const filtroUsuario = ref('todos')
  const buscar = ref('')

  const actividadesFiltradas = computed(() =>
    actividades.value.filter(a => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [a.contacto, a.empresa, a.accion].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroTipo.value === 'todos' || a.tipo === filtroTipo.value)
        && (filtroUsuario.value === 'todos' || a.usuario === filtroUsuario.value)
    })
  )

  const usuarios = computed(() => [...new Set(actividades.value.map(a => a.usuario))].sort())

  const crearActividad = (data: ActividadDraft) => {
    actividades.value = [createActividad(data), ...actividades.value]
  }

  return {
    actividades, filtroTipo, filtroUsuario, buscar,
    actividadesFiltradas, usuarios,
    crearActividad,
  }
}
