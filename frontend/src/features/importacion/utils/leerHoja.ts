import * as XLSX from 'xlsx'

export interface FilaPlantilla {
  filaExcel: number
  valores: Record<string, string>
}

const MAX_FILAS_BUSQUEDA_ENCABEZADO = 20

/** Busca, entre las primeras filas de la hoja, la que contiene los encabezados esperados (las
 * plantillas traen título + instrucciones en las primeras filas, igual que Plan Liga). */
function encontrarIndiceEncabezado(filasCrudas: unknown[][], headersEsperados: string[]): number {
  const limite = Math.min(filasCrudas.length, MAX_FILAS_BUSQUEDA_ENCABEZADO)
  const minCoincidencias = Math.max(1, Math.ceil(headersEsperados.length * 0.7))
  for (let i = 0; i < limite; i++) {
    const celdas = (filasCrudas[i] ?? []).map(v => String(v ?? '').trim().toUpperCase())
    const coincidencias = headersEsperados.filter(h => celdas.includes(h)).length
    if (coincidencias >= minCoincidencias) return i
  }
  throw new Error(
    `No se encontraron los encabezados esperados (${headersEsperados.slice(0, 3).join(', ')}...). `
    + 'Verifique que el archivo use la plantilla correspondiente descargada desde esta pantalla.',
  )
}

/**
 * Lee la primera hoja de un archivo .xlsx/.csv. La fila de encabezados se busca dinámicamente
 * (no se asume que sea la fila 1): las plantillas traen título e instrucciones en las primeras
 * filas, igual que la plantilla de Plan Liga. Descarta filas totalmente vacías. Los valores
 * quedan sin trim/normalizar: cada carga masiva decide cómo interpretarlos.
 *
 * `filaEjemplo` es la fila de ejemplo que trae la plantilla descargada (ver plantillas.ts):
 * si la primera fila de datos coincide exactamente con ella (el usuario no la borró ni la
 * modificó), se descarta automáticamente para no crearla como si fuera un registro real.
 */
export async function leerHoja(file: File, headersEsperados: string[], filaEjemplo?: Record<string, string>): Promise<FilaPlantilla[]> {
  const buffer = await file.arrayBuffer()
  const libro = XLSX.read(buffer, { type: 'array', cellDates: true })
  const hoja = libro.Sheets[libro.SheetNames[0]]
  const filasCrudas = XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1, raw: false, dateNF: 'dd/mm/yyyy', defval: '' })

  if (filasCrudas.length === 0) return []
  const indiceEncabezado = encontrarIndiceEncabezado(filasCrudas, headersEsperados)
  const headers = filasCrudas[indiceEncabezado].map(h => String(h ?? '').trim().toUpperCase())

  const filas: FilaPlantilla[] = []
  for (let i = indiceEncabezado + 1; i < filasCrudas.length; i++) {
    const cruda = filasCrudas[i]
    const valores: Record<string, string> = {}
    headers.forEach((h, idx) => { valores[h] = String(cruda[idx] ?? '').trim() })
    if (Object.values(valores).every(v => v === '')) continue // fila vacía, se ignora

    if (i === indiceEncabezado + 1 && filaEjemplo && esFilaEjemplo(valores, filaEjemplo)) continue

    filas.push({ filaExcel: i + 1, valores })
  }
  return filas
}

function esFilaEjemplo(valores: Record<string, string>, filaEjemplo: Record<string, string>): boolean {
  return Object.keys(filaEjemplo).every(
    h => valores[h].trim().toUpperCase() === (filaEjemplo[h] ?? '').trim().toUpperCase(),
  )
}

/** DD/MM/AAAA -> AAAA-MM-DD (formato que espera el backend); '' si no trae fecha. */
export function normalizarFechaImportacion(valor: string): { valor: string; invalida: boolean } {
  const texto = valor.trim()
  if (!texto) return { valor: '', invalida: false }
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return { valor: texto, invalida: false }
  const m = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (m) {
    const [, dd, mm, anioRaw] = m
    const anio = anioRaw.length === 2 ? (Number(anioRaw) < 50 ? `20${anioRaw}` : `19${anioRaw}`) : anioRaw
    return { valor: `${anio}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`, invalida: false }
  }
  return { valor: '', invalida: true }
}
