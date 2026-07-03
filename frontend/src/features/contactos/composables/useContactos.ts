import { ref, computed } from 'vue'
import type { Contacto, ContactoDraft } from '../types/contacto'
import { getContactos, createContacto, updateContacto } from '../services/contactos.api'

const PAGE_SIZE = 8

export function useContactos() {
  const contactos = ref<Contacto[]>(getContactos())

  const buscar            = ref('')
  const filtroEstado      = ref('todos')
  const filtroCiudad      = ref('todas')
  const filtroResponsable = ref('todos')
  const filtroSexo        = ref('todos')
  const filtroEdad        = ref('todos')

  const calcEdadBucket = (fechaNac: string): string => {
    if (!fechaNac) return ''
    const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear()
    if (edad < 18)  return '0-17'
    if (edad <= 35) return '18-35'
    if (edad <= 50) return '36-50'
    return '51+'
  }

  const contactosFiltrados = computed(() =>
    contactos.value.filter(c => {
      const q = buscar.value.toLowerCase()
      return (!q || [c.nombre, c.correo, c.empresa, c.documento].some(f => f.toLowerCase().includes(q)))
        && (filtroEstado.value      === 'todos'  || c.estado === filtroEstado.value)
        && (filtroCiudad.value      === 'todas'  || c.ciudad === filtroCiudad.value)
        && (filtroResponsable.value === 'todos'  || c.responsable === filtroResponsable.value)
        && (filtroSexo.value        === 'todos'  || c.sexo === filtroSexo.value)
        && (filtroEdad.value        === 'todos'  || calcEdadBucket(c.fechaNacimiento) === filtroEdad.value)
    })
  )

  const ciudades       = computed(() => [...new Set(contactos.value.map(c => c.ciudad))].sort())
  const responsables   = computed(() => [...new Set(contactos.value.map(c => c.responsable))].sort())
  const filtrosActivos = computed(() =>
    [filtroEstado.value !== 'todos', filtroCiudad.value !== 'todas',
     filtroResponsable.value !== 'todos', filtroSexo.value !== 'todos',
     filtroEdad.value !== 'todos'].filter(Boolean).length
  )

  const limpiarFiltros = () => {
    filtroEstado.value      = 'todos'
    filtroCiudad.value      = 'todas'
    filtroResponsable.value = 'todos'
    filtroSexo.value        = 'todos'
    filtroEdad.value        = 'todos'
  }

  const paginaActual = ref(1)
  const porPagina    = PAGE_SIZE
  const paginado     = computed(() => {
    const start = (paginaActual.value - 1) * porPagina
    return contactosFiltrados.value.slice(start, start + porPagina)
  })
  const totalPaginas = computed(() => Math.ceil(contactosFiltrados.value.length / porPagina))

  const crearContacto = (data: ContactoDraft) => {
    contactos.value = [createContacto(data), ...contactos.value]
  }

  const actualizarContacto = (id: number, data: ContactoDraft) => {
    const actualizado = updateContacto(id, data)
    if (!actualizado) return
    const idx = contactos.value.findIndex(c => c.id === id)
    if (idx !== -1) contactos.value[idx] = actualizado
  }

  return {
    contactos,
    buscar, filtroEstado, filtroCiudad, filtroResponsable, filtroSexo, filtroEdad,
    contactosFiltrados, ciudades, responsables, filtrosActivos, limpiarFiltros,
    paginaActual, porPagina, paginado, totalPaginas,
    crearContacto, actualizarContacto,
  }
}
