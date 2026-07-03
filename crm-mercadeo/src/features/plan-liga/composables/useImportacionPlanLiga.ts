import { ref } from 'vue'
import type { ResultadoImportacion, TipoImportacion } from '../types/plan-liga'
import { OPCIONES_IMPORT } from '../constants/plan-liga.constants'

export function useImportacionPlanLiga() {
  const tipoImport       = ref<TipoImportacion>('activar_titular')
  const archivoNombre    = ref('')
  const procesandoImport = ref(false)
  const resultadoImport  = ref<ResultadoImportacion | null>(null)
  const dragOverImport   = ref(false)

  const seleccionarTipo = (tipo: TipoImportacion) => {
    tipoImport.value = tipo
    resetImport()
  }

  const onDragOverImport  = (e: DragEvent) => { e.preventDefault(); dragOverImport.value = true }
  const onDragLeaveImport = () => { dragOverImport.value = false }
  const onDropImport = (e: DragEvent) => {
    e.preventDefault(); dragOverImport.value = false
    const file = e.dataTransfer?.files[0]
    if (file) archivoNombre.value = file.name
  }
  const onFileInput = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) archivoNombre.value = file.name
  }

  const procesarImport = () => {
    if (!archivoNombre.value) return
    procesandoImport.value = true
    resultadoImport.value = null
    setTimeout(() => {
      procesandoImport.value = false
      resultadoImport.value = { total: 24, exitosos: 21, errores: 3 }
    }, 1800)
  }

  const resetImport = () => {
    archivoNombre.value = ''
    resultadoImport.value = null
  }

  const descargarPlantilla = () => {
    const op = OPCIONES_IMPORT.find(o => o.key === tipoImport.value)
    console.log('Descargando plantilla:', op?.label)
  }

  return {
    tipoImport, archivoNombre, procesandoImport, resultadoImport, dragOverImport,
    seleccionarTipo, onDragOverImport, onDragLeaveImport, onDropImport, onFileInput,
    procesarImport, resetImport, descargarPlantilla,
  }
}
