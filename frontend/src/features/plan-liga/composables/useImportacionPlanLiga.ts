import { ref, computed, onMounted } from 'vue'
import type { AccionMasiva, PlanServicio, ResultadoImportacion, TipoImportacion } from '../types/plan-liga'
import { CUPO_MAXIMO } from '../constants/plan-liga.constants'
import { getPlanesServicio } from '../services/plan-liga.api'
import { parsearArchivoCargaMasiva, procesarCargaMasiva } from '../utils/cargaMasiva'

export function useImportacionPlanLiga() {
  const tipoImport       = ref<TipoImportacion>('agregar_grupos')
  const accionMasiva     = ref<AccionMasiva>('activar')
  const archivoNombre    = ref('')
  const archivo          = ref<File | null>(null)
  const procesandoImport = ref(false)
  const resultadoImport  = ref<ResultadoImportacion | null>(null)
  const dragOverImport   = ref(false)
  const progresoImport   = ref({ hechos: 0, total: 0 })

  // Solo "agregar_grupos" (crear titulares + sus beneficiarios) está conectado al backend
  // por ahora; necesita saber el cupo de beneficiarios del plan elegido para agrupar filas.
  const planesServicio = ref<PlanServicio[]>([])
  const planSeleccionado = ref<number | 'estandar'>('estandar')
  const cupoBeneficiarios = computed(() => {
    if (planSeleccionado.value === 'estandar') return CUPO_MAXIMO
    return planesServicio.value.find(p => p.id === planSeleccionado.value)?.cupoBeneficiarios ?? CUPO_MAXIMO
  })

  onMounted(async () => {
    try {
      planesServicio.value = await getPlanesServicio()
    } catch {
      planesServicio.value = []
    }
  })

  const seleccionarTipo = (tipo: TipoImportacion) => {
    tipoImport.value = tipo
    resetImport()
  }

  const guardarArchivo = (file: File) => {
    archivo.value = file
    archivoNombre.value = file.name
  }

  const onDragOverImport  = (e: DragEvent) => { e.preventDefault(); dragOverImport.value = true }
  const onDragLeaveImport = () => { dragOverImport.value = false }
  const onDropImport = (e: DragEvent) => {
    e.preventDefault(); dragOverImport.value = false
    const file = e.dataTransfer?.files[0]
    if (file) guardarArchivo(file)
  }
  const onFileInput = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) guardarArchivo(file)
  }

  const procesarImport = async () => {
    if (!archivo.value) return

    if (tipoImport.value !== 'agregar_grupos') {
      resultadoImport.value = {
        total: 0, exitosos: 0, errores: 1,
        detalleErrores: ['Esta opción todavía no está conectada al backend; por ahora solo "Agregar grupos" procesa el archivo de verdad.'],
      }
      return
    }

    procesandoImport.value = true
    resultadoImport.value = null
    progresoImport.value = { hechos: 0, total: 0 }
    try {
      const filas = await parsearArchivoCargaMasiva(archivo.value)
      const tipoPlanId = planSeleccionado.value === 'estandar' ? null : planSeleccionado.value
      resultadoImport.value = await procesarCargaMasiva(
        filas,
        { tipoPlanId, cupoBeneficiarios: cupoBeneficiarios.value },
        (hechos, total) => { progresoImport.value = { hechos, total } },
      )
    } catch (e) {
      resultadoImport.value = {
        total: 0, exitosos: 0, errores: 1,
        detalleErrores: [e instanceof Error ? e.message : 'No se pudo procesar el archivo.'],
      }
    } finally {
      procesandoImport.value = false
    }
  }

  const resetImport = () => {
    archivoNombre.value = ''
    archivo.value = null
    resultadoImport.value = null
    progresoImport.value = { hechos: 0, total: 0 }
  }

  // La plantilla de titulares+beneficiarios vive en frontend/public/Plantilla_Carga_PlanLiga.xlsx.
  // "titular" y "beneficiario" todavía no tienen plantilla real.
  const descargarPlantilla = () => {
    const esGrupos = tipoImport.value === 'agregar_grupos'
    const enlace = document.createElement('a')
    enlace.href = esGrupos ? '/Plantilla_Carga_PlanLiga.xlsx' : `/plantillas/${tipoImport.value}.xlsx`
    enlace.download = esGrupos ? 'Plantilla_Carga_PlanLiga.xlsx' : `plan-liga-${tipoImport.value}.xlsx`
    enlace.click()
  }

  return {
    tipoImport, accionMasiva, archivoNombre, procesandoImport, resultadoImport, dragOverImport, progresoImport,
    planesServicio, planSeleccionado, cupoBeneficiarios,
    seleccionarTipo, onDragOverImport, onDragLeaveImport, onDropImport, onFileInput,
    procesarImport, resetImport, descargarPlantilla,
  }
}
