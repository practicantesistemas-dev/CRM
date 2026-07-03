import { ref } from 'vue'
import type { RegistroImportacion, ResultadoImportacion, TipoImportacion } from '../types/importacion'
import { getHistorial, procesarArchivo as procesarArchivoApi } from '../services/importacion.api'

export function useImportacion() {
  const historial = ref<RegistroImportacion[]>(getHistorial())

  const archivoSeleccionado = ref<File | null>(null)
  const procesando = ref(false)
  const resultadoVisible = ref(false)
  const resultadoMock = ref<ResultadoImportacion>({ registros: 0, exitosos: 0, duplicados: 0, errores: 0 })
  const tipoImportacion = ref<TipoImportacion>('contactos')

  const seleccionarArchivo = (file: File) => {
    archivoSeleccionado.value = file
  }

  const procesarArchivo = async () => {
    if (!archivoSeleccionado.value) return
    procesando.value = true
    const registro = await procesarArchivoApi(archivoSeleccionado.value)
    historial.value = [registro, ...historial.value]
    resultadoMock.value = {
      registros: registro.registros,
      exitosos: registro.exitosos,
      duplicados: registro.duplicados,
      errores: registro.errores,
    }
    procesando.value = false
    resultadoVisible.value = true
  }

  const limpiar = () => {
    archivoSeleccionado.value = null
    resultadoVisible.value = false
    procesando.value = false
  }

  return {
    historial, archivoSeleccionado, procesando, resultadoVisible, resultadoMock, tipoImportacion,
    seleccionarArchivo, procesarArchivo, limpiar,
  }
}
