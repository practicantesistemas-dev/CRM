import { ref, computed, watch } from 'vue'
import type { Contacto, ContactoDraft, Etiqueta, EtiquetaDraft } from '../types/contacto'
import {
  getContactos, createContacto,
  getEtiquetas, createEtiqueta,
} from '../services/contactos.api'
import { useUbicaciones } from '@/shared/composables/useUbicaciones'

const PAGE_SIZE = 6

export function useContactos() {
  const contactos = ref<Contacto[]>([])
  const cargandoContactos = ref(false)
  const errorContactos = ref<string | null>(null)

  const cargarContactos = async () => {
    cargandoContactos.value = true
    errorContactos.value = null
    try {
      contactos.value = await getContactos()
    } catch (e) {
      errorContactos.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de contactos.'
    } finally {
      cargandoContactos.value = false
    }
  }

  const buscar             = ref('')
  const filtroEstado       = ref('todos')
  const filtroCiudad       = ref('todas')
  const filtroDepartamento = ref('todos')
  const filtroResponsable  = ref('todos')
  const filtroSexo         = ref('todos')
  const filtroEdad         = ref('todos')

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
        && (filtroEstado.value       === 'todos'  || c.estado === filtroEstado.value)
        && (filtroCiudad.value       === 'todas'  || c.ciudad === filtroCiudad.value)
        && (filtroDepartamento.value === 'todos'  || c.departamento === filtroDepartamento.value)
        && (filtroResponsable.value  === 'todos'  || c.responsable === filtroResponsable.value)
        && (filtroSexo.value         === 'todos'  || c.sexo === filtroSexo.value)
        && (filtroEdad.value         === 'todos'  || calcEdadBucket(c.fechaNacimiento) === filtroEdad.value)
    })
  )

  const ciudades       = computed(() => [...new Set(contactos.value.map(c => c.ciudad))].sort())
  const departamentosLista = computed(() => [...new Set(contactos.value.map(c => c.departamento))].sort())
  const responsables   = computed(() => [...new Set(contactos.value.map(c => c.responsable))].sort())
  const filtrosActivos = computed(() =>
    [filtroEstado.value !== 'todos', filtroCiudad.value !== 'todas', filtroDepartamento.value !== 'todos',
     filtroResponsable.value !== 'todos', filtroSexo.value !== 'todos',
     filtroEdad.value !== 'todos'].filter(Boolean).length
  )

  const limpiarFiltros = () => {
    filtroEstado.value       = 'todos'
    filtroCiudad.value       = 'todas'
    filtroDepartamento.value = 'todos'
    filtroResponsable.value  = 'todos'
    filtroSexo.value         = 'todos'
    filtroEdad.value         = 'todos'
  }

  const paginaActual = ref(1)
  const porPagina    = PAGE_SIZE
  const paginado     = computed(() => {
    const start = (paginaActual.value - 1) * porPagina
    return contactosFiltrados.value.slice(start, start + porPagina)
  })
  const totalPaginas = computed(() => Math.ceil(contactosFiltrados.value.length / porPagina))

  // Si cambia la búsqueda o algún filtro, se vuelve a la página 1: si te quedabas en una
  // página que ya no existe (ej. estabas en la 2 y el filtro dejó 6 o menos resultados),
  // "paginado" quedaba vacío por el slice fuera de rango, mostrando "sin resultados" mal.
  watch([buscar, filtroEstado, filtroCiudad, filtroDepartamento, filtroResponsable, filtroSexo, filtroEdad], () => {
    paginaActual.value = 1
  })

  const guardandoContacto = ref(false)
  const errorGuardarContacto = ref<string | null>(null)

  const crearContacto = async (data: ContactoDraft): Promise<boolean> => {
    guardandoContacto.value = true
    errorGuardarContacto.value = null
    try {
      const nuevo = await createContacto(data)
      contactos.value = [nuevo, ...contactos.value]
      return true
    } catch (e) {
      errorGuardarContacto.value = e instanceof Error ? e.message : 'No se pudo crear el contacto.'
      return false
    } finally {
      guardandoContacto.value = false
    }
  }

  // Todavía no hay un PUT/PATCH /api/contactos/{id} real: el cambio solo se refleja
  // en la tabla en memoria y se pierde al recargar la página.
  const actualizarContacto = (id: number, data: ContactoDraft) => {
    const idx = contactos.value.findIndex(c => c.id === id)
    if (idx === -1) return
    // data.ciudad/data.departamento son el código elegido en el Select; se resuelven a
    // nombre legible para la tabla/filtros (mismo criterio que mapContactoResponse al crear).
    const { departamentos, municipios } = useUbicaciones()
    const depto = departamentos.value.find(d => d.codigo === data.departamento)
    const municipio = municipios.value.find(m => m.codigo === data.ciudad && m.departamentoCodigo === data.departamento)
    contactos.value[idx] = {
      ...data, id, etiquetas: [...data.etiquetas],
      responsable: contactos.value[idx].responsable,
      ciudad: municipio?.nombre ?? data.ciudad,
      departamento: depto?.nombre ?? data.departamento,
      ciudadCodigo: data.ciudad,
      departamentoCodigo: data.departamento,
    }
  }

  // ─── Etiquetas (catálogo real para el selector del formulario) ──────────────
  const etiquetas = ref<Etiqueta[]>([])
  const cargandoEtiquetas = ref(false)
  const errorEtiquetas = ref<string | null>(null)

  const cargarEtiquetas = async () => {
    cargandoEtiquetas.value = true
    errorEtiquetas.value = null
    try {
      etiquetas.value = await getEtiquetas()
    } catch (e) {
      errorEtiquetas.value = e instanceof Error ? e.message : 'No se pudieron cargar las etiquetas.'
    } finally {
      cargandoEtiquetas.value = false
    }
  }

  const creandoEtiqueta = ref(false)
  const errorCrearEtiqueta = ref<string | null>(null)

  const crearEtiqueta = async (data: EtiquetaDraft): Promise<Etiqueta | null> => {
    creandoEtiqueta.value = true
    errorCrearEtiqueta.value = null
    try {
      const nueva = await createEtiqueta(data)
      etiquetas.value = [...etiquetas.value, nueva]
      return nueva
    } catch (e) {
      errorCrearEtiqueta.value = e instanceof Error ? e.message : 'No se pudo crear la etiqueta.'
      return null
    } finally {
      creandoEtiqueta.value = false
    }
  }

  return {
    contactos, cargandoContactos, errorContactos, cargarContactos,
    buscar, filtroEstado, filtroCiudad, filtroDepartamento, filtroResponsable, filtroSexo, filtroEdad,
    contactosFiltrados, ciudades, departamentosLista, responsables, filtrosActivos, limpiarFiltros,
    paginaActual, porPagina, paginado, totalPaginas,
    crearContacto, actualizarContacto, guardandoContacto, errorGuardarContacto,
    etiquetas, cargandoEtiquetas, errorEtiquetas, cargarEtiquetas,
    crearEtiqueta, creandoEtiqueta, errorCrearEtiqueta,
  }
}
