import { ref, computed, watch } from 'vue'
import type { RegistroImportacion, ResultadoImportacion, TipoImportacion } from '../types/importacion'
import { leerHoja } from '../utils/leerHoja'
import { procesarCargaMasivaContactos } from '../utils/cargaMasivaContactos'
import { procesarCargaMasivaEmpresas } from '../utils/cargaMasivaEmpresas'
import { procesarCargaMasivaProveedores } from '../utils/cargaMasivaProveedores'
import {
  descargarPlantilla, FILA_EJEMPLO_CONTACTOS, FILA_EJEMPLO_EMPRESAS, FILA_EJEMPLO_PROVEEDORES,
  HEADERS_CONTACTOS, HEADERS_EMPRESAS, HEADERS_PROVEEDORES,
} from '../utils/plantillas'
import { descargarErroresExcel } from '../utils/descargarErroresExcel'
import { getHistorialRemoto, registrarImportacion } from '../services/importacion.api'
import { getEmpresas } from '@/features/empresas/services/empresas.api'
import { getEtiquetas } from '@/features/contactos/services/contactos.api'
import { useUbicaciones, esperarUbicaciones } from '@/shared/composables/useUbicaciones'
import { useAuth } from '@/features/auth/composables/useAuth'

const RESULTADO_VACIO: ResultadoImportacion = { registros: 0, exitosos: 0, errores: 0, detalleErrores: [], avisos: [] }
const PAGE_SIZE = 4

export function useImportacion() {
  const historial = ref<RegistroImportacion[]>([])
  const cargandoHistorial = ref(false)
  const errorHistorial = ref<string | null>(null)

  // Búsqueda del historial por rango de fechas ('YYYY-MM-DD', igual que RegistroImportacion.fecha).
  const filtroFechaDesde = ref('')
  const filtroFechaHasta = ref('')
  const historialFiltrado = computed(() =>
    historial.value.filter(r =>
      (!filtroFechaDesde.value || r.fecha >= filtroFechaDesde.value)
      && (!filtroFechaHasta.value || r.fecha <= filtroFechaHasta.value),
    ),
  )

  const paginaHistorial = ref(1)
  const porPaginaHistorial = PAGE_SIZE
  const historialPaginado = computed(() => {
    const start = (paginaHistorial.value - 1) * porPaginaHistorial
    return historialFiltrado.value.slice(start, start + porPaginaHistorial)
  })
  const totalPaginasHistorial = computed(() => Math.ceil(historialFiltrado.value.length / porPaginaHistorial))
  watch([filtroFechaDesde, filtroFechaHasta], () => { paginaHistorial.value = 1 })

  const cargarHistorial = async () => {
    cargandoHistorial.value = true
    errorHistorial.value = null
    try {
      historial.value = await getHistorialRemoto()
    } catch (e) {
      errorHistorial.value = e instanceof Error ? e.message : 'No se pudo cargar el historial de importaciones.'
    } finally {
      cargandoHistorial.value = false
    }
  }

  const archivoSeleccionado = ref<File | null>(null)
  const procesando = ref(false)
  const resultadoVisible = ref(false)
  const resultado = ref<ResultadoImportacion>({ ...RESULTADO_VACIO })
  const tipoImportacion = ref<TipoImportacion>('contactos')
  const progreso = ref({ hechos: 0, total: 0 })
  const errorProceso = ref<string | null>(null)

  const { departamentos, municipios } = useUbicaciones()

  const seleccionarArchivo = (file: File) => {
    archivoSeleccionado.value = file
    resultadoVisible.value = false
    errorProceso.value = null
  }

  const limpiar = () => {
    archivoSeleccionado.value = null
    resultadoVisible.value = false
    procesando.value = false
    errorProceso.value = null
    progreso.value = { hechos: 0, total: 0 }
  }

  // Cambiar de tipo (contactos/empresas/proveedores) invalida el archivo ya elegido: las
  // columnas de la plantilla son distintas por tipo.
  watch(tipoImportacion, limpiar)

  const procesarArchivo = async () => {
    const archivo = archivoSeleccionado.value
    if (!archivo) return
    procesando.value = true
    errorProceso.value = null
    progreso.value = { hechos: 0, total: 0 }

    try {
      const filaEjemplo = tipoImportacion.value === 'contactos' ? FILA_EJEMPLO_CONTACTOS
        : tipoImportacion.value === 'empresas' ? FILA_EJEMPLO_EMPRESAS
        : FILA_EJEMPLO_PROVEEDORES
      const headersEsperados = tipoImportacion.value === 'contactos' ? HEADERS_CONTACTOS
        : tipoImportacion.value === 'empresas' ? HEADERS_EMPRESAS
        : HEADERS_PROVEEDORES
      const filas = await leerHoja(archivo, headersEsperados, filaEjemplo)
      const onProgreso = (hechos: number, total: number) => { progreso.value = { hechos, total } }

      let r: ResultadoImportacion
      if (tipoImportacion.value === 'contactos') {
        const [empresas, etiquetas] = await Promise.all([getEmpresas(), getEtiquetas(), esperarUbicaciones()])
        r = await procesarCargaMasivaContactos(
          filas,
          { empresas, etiquetas, departamentos: departamentos.value, municipios: municipios.value },
          onProgreso,
        )
      } else if (tipoImportacion.value === 'empresas') {
        r = await procesarCargaMasivaEmpresas(filas, onProgreso)
      } else {
        r = await procesarCargaMasivaProveedores(filas, onProgreso)
      }

      resultado.value = r
      resultadoVisible.value = true

      // Deja constancia en mercadeo_crm_importaciones de quién hizo la carga y con qué
      // resultado. Si esto falla (ej. problema de red puntual), los registros ya se crearon
      // igual en contactos/empresas/proveedores: no tiene sentido bloquear al usuario por
      // esto, así que se deja un registro local con lo que sí se sabe y se avisa aparte.
      try {
        const guardado = await registrarImportacion(
          tipoImportacion.value, archivo.name, r.registros, r.errores, r.detalleErrores, r.avisos,
        )
        historial.value = [guardado, ...historial.value]
      } catch {
        historial.value = [{
          id: Date.now(),
          archivo: archivo.name,
          tipo: archivo.name.toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel',
          tipoImportacion: tipoImportacion.value,
          fecha: new Date().toISOString().split('T')[0],
          registros: r.registros,
          exitosos: r.exitosos,
          errores: r.errores,
          estado: r.errores > 0 ? 'Con errores' : 'Completado',
          usuario: useAuth().me.value?.nombres ?? '—',
          detalleErrores: r.detalleErrores,
          avisos: r.avisos,
        }, ...historial.value]
        errorHistorial.value = 'La importación se hizo correctamente, pero no se pudo guardar el registro en el historial (quedó solo en esta pantalla).'
      }
    } catch (e) {
      errorProceso.value = e instanceof Error ? e.message : 'No se pudo procesar el archivo.'
    } finally {
      procesando.value = false
    }
  }

  const descargarPlantillaActual = () => descargarPlantilla(tipoImportacion.value)

  const descargarReporteActual = () => {
    if (!archivoSeleccionado.value) return
    descargarErroresExcel([...resultado.value.detalleErrores, ...resultado.value.avisos], archivoSeleccionado.value.name)
  }

  const descargarErroresDeRegistro = (registro: RegistroImportacion) => {
    descargarErroresExcel([...registro.detalleErrores, ...registro.avisos], registro.archivo)
  }

  return {
    historial, cargandoHistorial, errorHistorial, cargarHistorial,
    filtroFechaDesde, filtroFechaHasta, historialFiltrado,
    paginaHistorial, historialPaginado, totalPaginasHistorial,
    archivoSeleccionado, procesando, resultadoVisible, resultado, tipoImportacion, progreso, errorProceso,
    seleccionarArchivo, procesarArchivo, limpiar,
    descargarPlantillaActual, descargarReporteActual, descargarErroresDeRegistro,
  }
}
