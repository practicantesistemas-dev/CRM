import * as XLSX from 'xlsx'
import type { AccionMasiva, ResultadoImportacion } from '../types/plan-liga'
import { activarBeneficiario, desactivarBeneficiario, getBeneficiariosTitular } from '../services/plan-liga.api'
import { normalizarFecha, buscarIdTitularPorDocumento } from './cargaMasiva'

const MAX_FILAS_BUSQUEDA_ENCABEZADO = 20

interface EncabezadoAccionBeneficiario {
  indice: number
  colTitular: number
  colBeneficiario: number
  colFecha: number
}

// No existe un endpoint para buscar un beneficiario directamente por su documento: hay que
// ubicar primero al titular (por su documento) y luego buscar entre sus beneficiarios. Por
// eso la plantilla pide el documento del titular y el del beneficiario en columnas separadas.
function encontrarEncabezadoAccionBeneficiario(filasCrudas: unknown[][]): EncabezadoAccionBeneficiario {
  const limite = Math.min(filasCrudas.length, MAX_FILAS_BUSQUEDA_ENCABEZADO)
  for (let i = 0; i < limite; i++) {
    const celdas = (filasCrudas[i] ?? []).map(v => String(v ?? '').trim().toUpperCase())
    const colTitular = celdas.indexOf('TITULAR_DOCUMENTO')
    const colBeneficiario = celdas.indexOf('BENEFICIARIO_DOCUMENTO')
    if (colTitular !== -1 && colBeneficiario !== -1) {
      return { indice: i, colTitular, colBeneficiario, colFecha: celdas.indexOf('FECHA_INGRESO') }
    }
  }
  throw new Error(
    'No se encontraron las columnas TITULAR_DOCUMENTO y BENEFICIARIO_DOCUMENTO. Verifique que el archivo use la plantilla de activar/desactivar beneficiario.',
  )
}

export interface FilaAccionBeneficiario {
  filaExcel: number
  titularDocumento: string
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

  const { indice, colTitular, colBeneficiario, colFecha } = encontrarEncabezadoAccionBeneficiario(todasLasFilas)
  const filasCrudas = todasLasFilas.slice(indice + 1)

  const filas: FilaAccionBeneficiario[] = []
  filasCrudas.forEach((cruda, idx) => {
    const titularDocumento = String(cruda[colTitular] ?? '').trim()
    const beneficiarioDocumento = String(cruda[colBeneficiario] ?? '').trim()
    if (!titularDocumento && !beneficiarioDocumento) return
    const fechaRaw = colFecha !== -1 ? cruda[colFecha] : ''
    const { valor: fechaIngreso, invalida: fechaInvalida } = normalizarFecha(fechaRaw)
    filas.push({ filaExcel: indice + 2 + idx, titularDocumento, beneficiarioDocumento, fechaIngreso, fechaInvalida })
  })
  return filas
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
    if (!fila.titularDocumento || !fila.beneficiarioDocumento) {
      detalleErrores.push(`Fila ${fila.filaExcel}: faltan TITULAR_DOCUMENTO o BENEFICIARIO_DOCUMENTO.`)
      hechos += 1
      onProgreso?.(hechos, total)
      continue
    }
    if (accion === 'activar' && (!fila.fechaIngreso || fila.fechaInvalida)) {
      detalleErrores.push(`Fila ${fila.filaExcel}: FECHA_INGRESO es obligatoria y debe tener un formato válido (DD/MM/AAAA) para activar.`)
      hechos += 1
      onProgreso?.(hechos, total)
      continue
    }

    try {
      const idTitular = await buscarIdTitularPorDocumento(fila.titularDocumento)
      if (idTitular === null) {
        detalleErrores.push(`Fila ${fila.filaExcel}: no se encontró un titular con el documento ${fila.titularDocumento}.`)
        hechos += 1
        onProgreso?.(hechos, total)
        continue
      }

      const beneficiarios = await getBeneficiariosTitular(idTitular)
      const beneficiario = beneficiarios.find(b => b.documento === fila.beneficiarioDocumento)
      if (!beneficiario) {
        detalleErrores.push(`Fila ${fila.filaExcel}: el titular ${fila.titularDocumento} no tiene un beneficiario con documento ${fila.beneficiarioDocumento}.`)
        hechos += 1
        onProgreso?.(hechos, total)
        continue
      }

      if (accion === 'activar') {
        await activarBeneficiario(idTitular, beneficiario.id, fila.fechaIngreso)
      } else {
        await desactivarBeneficiario(idTitular, beneficiario.id)
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
