import * as XLSX from 'xlsx'
import type { AccionMasiva, ResultadoImportacion } from '../types/plan-liga'
import {
  activarTitular, desactivarTitular, getBeneficiariosTitular, desactivarBeneficiario,
} from '../services/plan-liga.api'
import { normalizarFecha, buscarIdTitularPorDocumento } from './cargaMasiva'

const MAX_FILAS_BUSQUEDA_ENCABEZADO = 20

interface EncabezadoAccionTitular {
  indice: number
  colDocumento: number
  colFecha: number
}

/** Busca la fila de encabezados por contenido (no por posición fija): solo DOCUMENTO es
 * obligatorio en la plantilla; FECHA_INGRESO puede faltar si el archivo solo va a desactivar. */
function encontrarEncabezadoAccionTitular(filasCrudas: unknown[][]): EncabezadoAccionTitular {
  const limite = Math.min(filasCrudas.length, MAX_FILAS_BUSQUEDA_ENCABEZADO)
  for (let i = 0; i < limite; i++) {
    const celdas = (filasCrudas[i] ?? []).map(v => String(v ?? '').trim().toUpperCase())
    const colDocumento = celdas.indexOf('DOCUMENTO')
    if (colDocumento !== -1) return { indice: i, colDocumento, colFecha: celdas.indexOf('FECHA_INGRESO') }
  }
  throw new Error(
    'No se encontró la columna DOCUMENTO. Verifique que el archivo use la plantilla de activar/desactivar titular.',
  )
}

export interface FilaAccionTitular {
  filaExcel: number
  documento: string
  fechaIngreso: string
  fechaInvalida: boolean
}

export async function parsearArchivoAccionTitulares(file: File): Promise<FilaAccionTitular[]> {
  const buffer = await file.arrayBuffer()
  const libro = XLSX.read(buffer, { type: 'array', cellDates: true })
  const hoja = libro.Sheets[libro.SheetNames[0]]
  const todasLasFilas = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
    header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: '',
  })

  const { indice, colDocumento, colFecha } = encontrarEncabezadoAccionTitular(todasLasFilas)
  const filasCrudas = todasLasFilas.slice(indice + 1)

  const filas: FilaAccionTitular[] = []
  filasCrudas.forEach((cruda, idx) => {
    const documento = String(cruda[colDocumento] ?? '').trim()
    if (!documento) return
    const fechaRaw = colFecha !== -1 ? cruda[colFecha] : ''
    const { valor: fechaIngreso, invalida: fechaInvalida } = normalizarFecha(fechaRaw)
    filas.push({ filaExcel: indice + 2 + idx, documento, fechaIngreso, fechaInvalida })
  })
  return filas
}

function validarFormatoFila(fila: FilaAccionTitular, accion: AccionMasiva): string | null {
  if (accion === 'activar' && (!fila.fechaIngreso || fila.fechaInvalida)) {
    return `Fila ${fila.filaExcel}: FECHA_INGRESO es obligatoria y debe tener un formato válido (DD/MM/AAAA) para activar.`
  }
  return null
}

/** Validación de formato sin tocar el backend: se usa para bloquear la importación
 * completa antes de ejecutar ninguna acción si el archivo trae datos inválidos. */
export function validarFilasAccionTitulares(filas: FilaAccionTitular[], accion: AccionMasiva): string[] {
  return filas.map(f => validarFormatoFila(f, accion)).filter((e): e is string => e !== null)
}

export async function procesarAccionMasivaTitulares(
  filas: FilaAccionTitular[],
  accion: AccionMasiva,
  onProgreso?: (hechos: number, total: number) => void,
): Promise<ResultadoImportacion> {
  const total = filas.length
  const detalleErrores: string[] = []
  let exitosos = 0
  let hechos = 0

  for (const fila of filas) {
    const errorFormato = validarFormatoFila(fila, accion)
    if (errorFormato) {
      detalleErrores.push(errorFormato)
      hechos += 1
      onProgreso?.(hechos, total)
      continue
    }

    try {
      const idTitular = await buscarIdTitularPorDocumento(fila.documento)
      if (idTitular === null) {
        detalleErrores.push(`Fila ${fila.filaExcel}: no se encontró un titular con el documento ${fila.documento}.`)
        hechos += 1
        onProgreso?.(hechos, total)
        continue
      }

      if (accion === 'activar') {
        await activarTitular(idTitular, fila.fechaIngreso)
      } else {
        await desactivarTitular(idTitular)
        // Al desactivar el titular, sus beneficiarios activos quedan sin titular vigente:
        // se desactivan también para que no queden huérfanos en estado Activo.
        const beneficiarios = await getBeneficiariosTitular(idTitular)
        for (const beneficiario of beneficiarios.filter(b => b.estado === 'Activo')) {
          try {
            await desactivarBeneficiario(idTitular, beneficiario.id)
          } catch (e) {
            detalleErrores.push(
              `Fila ${fila.filaExcel}: el titular ${fila.documento} se desactivó pero no se pudo desactivar a su beneficiario ${beneficiario.documento}: ${e instanceof Error ? e.message : 'error desconocido'}`,
            )
          }
        }
      }
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${e instanceof Error ? e.message : `no se pudo ${accion} el titular ${fila.documento}`}`)
    }
    hechos += 1
    onProgreso?.(hechos, total)
  }

  return { total, exitosos, errores: detalleErrores.length, detalleErrores }
}
