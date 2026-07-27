import * as XLSX from 'xlsx'
import type { AccionMasiva, ResultadoImportacion } from '../types/plan-liga'
import { activarBeneficiarioPorDocumento, desactivarBeneficiarioPorDocumento } from '../services/plan-liga.api'
import { normalizarFecha } from './cargaMasiva'

const MAX_FILAS_BUSQUEDA_ENCABEZADO = 20

interface EncabezadoAccionBeneficiario {
  indice: number
  colBeneficiario: number
  colFecha: number
}

function encontrarEncabezadoAccionBeneficiario(filasCrudas: unknown[][]): EncabezadoAccionBeneficiario {
  const limite = Math.min(filasCrudas.length, MAX_FILAS_BUSQUEDA_ENCABEZADO)
  for (let i = 0; i < limite; i++) {
    const celdas = (filasCrudas[i] ?? []).map(v => String(v ?? '').trim().toUpperCase())
    const colBeneficiario = celdas.indexOf('BENEFICIARIO_DOCUMENTO')
    if (colBeneficiario !== -1) {
      return { indice: i, colBeneficiario, colFecha: celdas.indexOf('FECHA_INGRESO') }
    }
  }
  throw new Error(
    'No se encontró la columna BENEFICIARIO_DOCUMENTO. Verifique que el archivo use la plantilla de activar/desactivar beneficiario.',
  )
}

export interface FilaAccionBeneficiario {
  filaExcel: number
  beneficiarioDocumento: string
  fechaIngreso: string
  fechaInvalida: boolean
}

export async function parsearArchivoAccionBeneficiarios(file: File): Promise<FilaAccionBeneficiario[]> {
  const buffer = await file.arrayBuffer()
  const libro = XLSX.read(buffer, { type: 'array', cellDates: true })
  const hoja = libro.Sheets[libro.SheetNames[0]]
  const todasLasFilas = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
    header: 1, raw: false, dateNF: 'yyyy-mm-dd', defval: '',
  })

  const { indice, colBeneficiario, colFecha } = encontrarEncabezadoAccionBeneficiario(todasLasFilas)
  const filasCrudas = todasLasFilas.slice(indice + 1)

  const filas: FilaAccionBeneficiario[] = []
  filasCrudas.forEach((cruda, idx) => {
    const beneficiarioDocumento = String(cruda[colBeneficiario] ?? '').trim()
    if (!beneficiarioDocumento) return
    const fechaRaw = colFecha !== -1 ? cruda[colFecha] : ''
    const { valor: fechaIngreso, invalida: fechaInvalida } = normalizarFecha(fechaRaw)
    filas.push({ filaExcel: indice + 2 + idx, beneficiarioDocumento, fechaIngreso, fechaInvalida })
  })
  return filas
}

function validarFormatoFila(fila: FilaAccionBeneficiario, accion: AccionMasiva): string | null {
  if (!fila.beneficiarioDocumento) return `Fila ${fila.filaExcel}: falta BENEFICIARIO_DOCUMENTO.`
  if (accion === 'activar' && (!fila.fechaIngreso || fila.fechaInvalida)) {
    return `Fila ${fila.filaExcel}: FECHA_INGRESO es obligatoria y debe tener un formato válido (DD/MM/AAAA) para activar.`
  }
  return null
}

/** Validación de formato sin tocar el backend: se usa para bloquear la importación
 * completa antes de ejecutar ninguna acción si el archivo trae datos inválidos. */
export function validarFilasAccionBeneficiarios(filas: FilaAccionBeneficiario[], accion: AccionMasiva): string[] {
  return filas.map(f => validarFormatoFila(f, accion)).filter((e): e is string => e !== null)
}

export async function procesarAccionMasivaBeneficiarios(
  filas: FilaAccionBeneficiario[],
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
      if (accion === 'activar') {
        await activarBeneficiarioPorDocumento(fila.beneficiarioDocumento, fila.fechaIngreso)
      } else {
        await desactivarBeneficiarioPorDocumento(fila.beneficiarioDocumento)
      }
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${e instanceof Error ? e.message : `no se pudo ${accion} el beneficiario ${fila.beneficiarioDocumento}`}`)
    }
    hechos += 1
    onProgreso?.(hechos, total)
  }

  return { total, exitosos, errores: detalleErrores.length, detalleErrores }
}
