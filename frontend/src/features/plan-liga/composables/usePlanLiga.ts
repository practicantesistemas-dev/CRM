import { ref, computed,onMounted  } from 'vue'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft } from '../types/plan-liga'
import { CUPO_MAXIMO } from '../constants/plan-liga.constants'
import {
  getTitulares, createTitular, updateTitular,
  getBeneficiarios, createBeneficiario, updateBeneficiario, getResumenTitulares,
} from '../services/plan-liga.api'

export function usePlanLiga() {
  const titulares = ref<Titular[]>(getTitulares())
  const beneficiarios = ref<Beneficiario[]>(getBeneficiarios())

  const activosPorTitular = (id: number) =>
    beneficiarios.value.filter(b => b.titularId === id && b.estado === 'Activo').length
  const puedeAgregar = (id: number) => activosPorTitular(id) < CUPO_MAXIMO

  const buscar       = ref('')
  const filtroEstado = ref('todos')
  const filtroPlan   = ref('todos')
  const filtroSexo   = ref('todos')
  const filtroEdad   = ref('todos')

  const calcEdadBucket = (fechaNac: string): string => {
    if (!fechaNac) return ''
    const edad = new Date().getFullYear() - new Date(fechaNac).getFullYear()
    if (edad < 18)  return '0-17'
    if (edad <= 35) return '18-35'
    if (edad <= 50) return '36-50'
    return '51+'
  }

  const titularesFiltrados = computed(() =>
    titulares.value.filter(t => {
      const q = buscar.value.toLowerCase()
      return (!q || [t.nombre, t.documento, t.empresa, t.correo].some(f => f.toLowerCase().includes(q)))
        && (filtroEstado.value === 'todos' || t.estado === filtroEstado.value)
        && (filtroPlan.value   === 'todos' || t.planContratado === filtroPlan.value)
        && (filtroSexo.value   === 'todos' || t.sexo === filtroSexo.value)
        && (filtroEdad.value   === 'todos' || calcEdadBucket(t.fechaNacimiento) === filtroEdad.value)
    })
  )
  const planes = computed(() => [...new Set(titulares.value.map(t => t.planContratado))].sort())

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
  })

  const titularesTope      = computed(() => titulares.value.filter(t => activosPorTitular(t.id) >= CUPO_MAXIMO).length)

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
    titularesFiltrados, planes,
    totalActivos, totalBeneficiarios, titularesTope, errorResumen,
    activosPorTitular, puedeAgregar,
    crearTitular, actualizarTitular, toggleEstadoTitular,
    beneficiariosDeTitular, crearBeneficiario, actualizarBeneficiario, cambiarEstadoBeneficiario,
  }
}
