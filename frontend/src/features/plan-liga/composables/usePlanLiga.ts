import { ref, computed, onMounted, watch } from 'vue'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft } from '../types/plan-liga'
import { CUPO_MAXIMO } from '../constants/plan-liga.constants'
import {
  createTitular, updateTitular,
  getBeneficiarios, createBeneficiario, updateBeneficiario, getResumenTitulares,
  getListadoTitulares, getNombresPlanes, getTitular,
} from '../services/plan-liga.api'

export function usePlanLiga() {
  const titulares = ref<Titular[]>([])
  const cargandoTitulares = ref(false)
  const errorTitulares = ref<string | null>(null)
  const beneficiarios = ref<Beneficiario[]>(getBeneficiarios())

  const activosPorTitular = (id: number) =>
    beneficiarios.value.filter(b => b.titularId === id && b.estado === 'Activo').length
  const puedeAgregar = (id: number) => activosPorTitular(id) < CUPO_MAXIMO

  const buscar       = ref('')
  const filtroEstado = ref('todos')
  const filtroPlan   = ref('todos')
  const filtroSexo   = ref('todos')
  const filtroEdad   = ref('todos')

  // estado, plan, sexo y edad ya vienen filtrados desde el backend (ver cargarTitulares).
  const titularesFiltrados = computed(() =>
    titulares.value.filter(t => {
      const q = buscar.value.toLowerCase()
      return !q || [t.nombre, t.documento, t.empresa, t.correo].some(f => f.toLowerCase().includes(q))
    })
  )
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
      titulares.value = await getListadoTitulares({
        limit: 1000,
        estado: filtroEstado.value === 'todos' ? undefined : (filtroEstado.value as 'Activo' | 'Inactivo'),
        plan: filtroPlan.value === 'todos' ? undefined : filtroPlan.value,
        // 'Otro' no tiene código en el backend (solo M/F), así que no se envía y no filtra.
        sexo: filtroSexo.value === 'Masculino' || filtroSexo.value === 'Femenino' ? filtroSexo.value : undefined,
        edad: filtroEdad.value === 'todos' ? undefined : (filtroEdad.value as '0-17' | '18-35' | '36-50' | '51+'),
      })
    } catch (e) {
      errorTitulares.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de titulares.'
    } finally {
      cargandoTitulares.value = false
    }
  }

  watch([filtroEstado, filtroPlan, filtroSexo, filtroEdad], cargarTitulares)

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

  const crearBeneficiario = (titularId: number, data: BeneficiarioDraft) => {
    beneficiarios.value = [...beneficiarios.value, createBeneficiario(titularId, data)]
  }
  const actualizarBeneficiario = (id: number, data: BeneficiarioDraft) => {
    const actualizado = updateBeneficiario(id, data)
    if (!actualizado) return
    const idx = beneficiarios.value.findIndex(b => b.id === id)
    if (idx !== -1) beneficiarios.value[idx] = actualizado
  }
  const cambiarEstadoBeneficiario = (b: Beneficiario, estado: Beneficiario['estado']) => {
    const actualizado = updateBeneficiario(b.id, { ...b, estado })
    if (!actualizado) return
    const idx = beneficiarios.value.findIndex(x => x.id === b.id)
    if (idx !== -1) beneficiarios.value[idx] = actualizado
  }

  return {
    titulares, beneficiarios,
    buscar, filtroEstado, filtroPlan, filtroSexo, filtroEdad,
    titularesFiltrados, planes, cargandoTitulares, errorTitulares,
    totalActivos, totalBeneficiarios, titularesTope, errorResumen,
    activosPorTitular, puedeAgregar,
    cargandoDetalleTitular, obtenerTitular,
    crearTitular, actualizarTitular, toggleEstadoTitular,
    beneficiariosDeTitular, crearBeneficiario, actualizarBeneficiario, cambiarEstadoBeneficiario,
  }
}
