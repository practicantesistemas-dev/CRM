import { ref, computed, onMounted, watch } from 'vue'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft } from '../types/plan-liga'
import { CUPO_MAXIMO } from '../constants/plan-liga.constants'
import {
  createTitular, updateTitular,
  getBeneficiarios, createBeneficiario, updateBeneficiario, getResumenTitulares,
  getListadoTitulares, getNombresPlanes, getTitular, getBeneficiariosTitular,
} from '../services/plan-liga.api'

const TITULARES_POR_PAGINA = 6

export function usePlanLiga() {
  const titulares = ref<Titular[]>([])
  const cargandoTitulares = ref(false)
  const errorTitulares = ref<string | null>(null)
  const beneficiarios = ref<Beneficiario[]>(getBeneficiarios())

  const offsetTitulares = ref(0)
  const totalTitulares = ref(0)
  const paginaActual = computed(() => Math.floor(offsetTitulares.value / TITULARES_POR_PAGINA) + 1)
  const totalPaginas = computed(() => Math.max(1, Math.ceil(totalTitulares.value / TITULARES_POR_PAGINA)))
  const hayPaginaAnterior = computed(() => offsetTitulares.value > 0)
  const hayPaginaSiguiente = computed(() => offsetTitulares.value + TITULARES_POR_PAGINA < totalTitulares.value)

  const activosPorTitular = (id: number) =>
    beneficiarios.value.filter(b => b.titularId === id && b.estado === 'Activo').length
  const puedeAgregar = (id: number) => activosPorTitular(id) < CUPO_MAXIMO

  const buscar       = ref('')
  const filtroEstado = ref('todos')
  const filtroPlan   = ref('todos')
  const filtroSexo   = ref('todos')
  const filtroEdad   = ref('todos')

  const planes = ref<string[]>([])
  const cargarPlanes = async () => {
    try {
      planes.value = await getNombresPlanes()
    } catch {
      planes.value = []
    }
  }

  const cargarTitulares = async () => {
    cargandoTitulares.value = true
    errorTitulares.value = null
    try {
      const resultado = await getListadoTitulares({
        limit: TITULARES_POR_PAGINA,
        offset: offsetTitulares.value,
        estado: filtroEstado.value === 'todos' ? undefined : (filtroEstado.value as 'Activo' | 'Inactivo'),
        plan: filtroPlan.value === 'todos' ? undefined : filtroPlan.value,
        // 'Otro' no tiene código en el backend (solo M/F), así que no se envía y no filtra.
        sexo: filtroSexo.value === 'Masculino' || filtroSexo.value === 'Femenino' ? filtroSexo.value : undefined,
        edad: filtroEdad.value === 'todos' ? undefined : (filtroEdad.value as '0-17' | '18-35' | '36-50' | '51+'),
        busqueda: buscar.value.trim() || undefined,
      })
      titulares.value = resultado.items
      totalTitulares.value = resultado.total
    } catch (e) {
      errorTitulares.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de titulares.'
    } finally {
      cargandoTitulares.value = false
    }
  }

  const paginaSiguiente = () => {
    if (!hayPaginaSiguiente.value) return
    offsetTitulares.value += TITULARES_POR_PAGINA
    cargarTitulares()
  }
  const paginaAnterior = () => {
    if (!hayPaginaAnterior.value) return
    offsetTitulares.value = Math.max(0, offsetTitulares.value - TITULARES_POR_PAGINA)
    cargarTitulares()
  }

  watch([filtroEstado, filtroPlan, filtroSexo, filtroEdad], () => {
    offsetTitulares.value = 0
    cargarTitulares()
  })

  // La búsqueda se debounce para no disparar una petición por cada tecla.
  let busquedaTimeout: ReturnType<typeof setTimeout> | undefined
  watch(buscar, () => {
    clearTimeout(busquedaTimeout)
    busquedaTimeout = setTimeout(() => {
      offsetTitulares.value = 0
      cargarTitulares()
    }, 350)
  })

  const totalActivos = ref(0)
  const totalBeneficiarios = ref(0)
  const errorResumen = ref<string | null>(null)

  const cargarResumen = async () => {
    errorResumen.value = null
    try {
      const data = await getResumenTitulares()
      totalActivos.value = data.titulares_activos
      totalBeneficiarios.value = data.beneficiarios_activos
    } catch (e) {
      errorResumen.value = e instanceof Error ? e.message : 'No se pudo cargar el resumen de titulares.'
    }
  }

  onMounted(() => {
    cargarResumen()
    cargarTitulares()
    cargarPlanes()
  })

  const titularesTope      = computed(() => titulares.value.filter(t => activosPorTitular(t.id) >= CUPO_MAXIMO).length)

  const cargandoDetalleTitular = ref(false)
  const obtenerTitular = async (id: number): Promise<Titular | null> => {
    cargandoDetalleTitular.value = true
    try {
      return await getTitular(id)
    } catch {
      return null
    } finally {
      cargandoDetalleTitular.value = false
    }
  }

  const crearTitular = (data: TitularDraft) => {
    titulares.value = [createTitular(data), ...titulares.value]
  }
  const actualizarTitular = (id: number, data: TitularDraft) => {
    const actualizado = updateTitular(id, data)
    if (!actualizado) return
    const idx = titulares.value.findIndex(t => t.id === id)
    if (idx !== -1) titulares.value[idx] = actualizado
  }
  const toggleEstadoTitular = (t: Titular) => {
    actualizarTitular(t.id, { ...t, estado: t.estado === 'Activo' ? 'Inactivo' : 'Activo' })
  }

  const beneficiariosDeTitular = (titularId: number) =>
    beneficiarios.value.filter(b => b.titularId === titularId)

  const beneficiariosTitular = ref<Beneficiario[]>([])
  const cargandoBeneficiariosTitular = ref(false)
  const errorBeneficiariosTitular = ref<string | null>(null)

  const cargarBeneficiariosTitular = async (titularId: number) => {
    cargandoBeneficiariosTitular.value = true
    errorBeneficiariosTitular.value = null
    try {
      beneficiariosTitular.value = await getBeneficiariosTitular(titularId)
    } catch (e) {
      errorBeneficiariosTitular.value = e instanceof Error ? e.message : 'No se pudo cargar los beneficiarios del titular.'
      beneficiariosTitular.value = []
    } finally {
      cargandoBeneficiariosTitular.value = false
    }
  }

  const crearBeneficiario = (titularId: number, data: BeneficiarioDraft) => {
    beneficiarios.value = [...beneficiarios.value, createBeneficiario(titularId, data)]
  }

  const guardandoBeneficiario = ref(false)
  const errorGuardarBeneficiario = ref<string | null>(null)

  const actualizarBeneficiario = async (titularId: number, id: number, data: BeneficiarioDraft): Promise<boolean> => {
    guardandoBeneficiario.value = true
    errorGuardarBeneficiario.value = null
    try {
      const actualizado = await updateBeneficiario(titularId, id, data)
      const idx = beneficiariosTitular.value.findIndex(b => b.id === id)
      if (idx !== -1) beneficiariosTitular.value[idx] = actualizado
      return true
    } catch (e) {
      errorGuardarBeneficiario.value = e instanceof Error ? e.message : 'No se pudo actualizar el beneficiario.'
      return false
    } finally {
      guardandoBeneficiario.value = false
    }
  }

  const cambiarEstadoBeneficiario = (b: Beneficiario, estado: Beneficiario['estado']) => {
    const idx = beneficiariosTitular.value.findIndex(x => x.id === b.id)
    if (idx !== -1) beneficiariosTitular.value[idx] = { ...b, estado }
  }

  return {
    titulares, beneficiarios,
    buscar, filtroEstado, filtroPlan, filtroSexo, filtroEdad,
    planes, cargandoTitulares, errorTitulares,
    totalActivos, totalBeneficiarios, titularesTope, errorResumen,
    totalTitulares, paginaActual, totalPaginas, hayPaginaAnterior, hayPaginaSiguiente,
    paginaSiguiente, paginaAnterior,
    activosPorTitular, puedeAgregar,
    cargandoDetalleTitular, obtenerTitular,
    crearTitular, actualizarTitular, toggleEstadoTitular,
    beneficiariosDeTitular, crearBeneficiario, actualizarBeneficiario, cambiarEstadoBeneficiario,
    guardandoBeneficiario, errorGuardarBeneficiario,
    beneficiariosTitular, cargandoBeneficiariosTitular, errorBeneficiariosTitular, cargarBeneficiariosTitular,
  }
}
