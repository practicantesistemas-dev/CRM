import * as XLSX from 'xlsx'
import { joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import type { BeneficiarioDraft, TitularDraft } from '../types/plan-liga'
import { createBeneficiario, createTitular, getListadoTitulares } from '../services/plan-liga.api'

// La plantilla (Plantilla_Carga_PlanLiga.xlsx) trae encabezados, una fila de ejemplo que el
// usuario debe borrar antes de entregar el archivo, y luego los datos reales — columnas A-T
// en este orden. No asumimos números de fila fijos: si el usuario borra la fila de ejemplo
// (como indican las instrucciones) o edita el archivo, todo se corre. En su lugar buscamos la
// fila de encabezados por su contenido y calculamos la primera fila de datos a partir de ahí.
const COLUMNAS = [
  'tipoPlanTexto', 'tipoDocumento', 'documento', 'nombre1', 'nombre2', 'apellido1', 'apellido2',
  'fechaNacimiento', 'sexo', 'direccion', 'ciudad', 'departamento', 'correo', 'telefono',
  'fechaIngreso', 'empresa', 'eps', 'otraEps', 'planSalud', 'planNombre',
] as const
type Columna = (typeof COLUMNAS)[number]

const ENCABEZADOS_ESPERADOS = [
  'TIPO_PLAN', 'TIPO', 'DOCUMENTO', 'NOMBRE1', 'NOMBRE2', 'APELLIDO1', 'APELLIDO2',
  'FECHA_NACIMIENTO', 'SEXO', 'DIRECCION', 'CIUDAD', 'DEPARTAMENTO', 'CORREO', 'TELEFONO',
  'FECHA_INGRESO', 'EMPRESA', 'EPS', 'OTRAEPS', 'PLAN_SALUD', 'PLAN_NOMBRE',
]
const MAX_FILAS_BUSQUEDA_ENCABEZADO = 20
const MIN_COINCIDENCIAS_ENCABEZADO = 15 // tolera pequeñas variaciones de nombre en algunas columnas

/** Busca, entre las primeras filas de la hoja, la que contiene los encabezados de la plantilla. */
function encontrarIndiceEncabezado(filasCrudas: unknown[][]): number {
  const limite = Math.min(filasCrudas.length, MAX_FILAS_BUSQUEDA_ENCABEZADO)
  for (let i = 0; i < limite; i++) {
    const celdas = (filasCrudas[i] ?? []).map(v => String(v ?? '').trim().toUpperCase())
    const coincidencias = ENCABEZADOS_ESPERADOS.filter(h => celdas.includes(h)).length
    if (coincidencias >= MIN_COINCIDENCIAS_ENCABEZADO) return i
  }
  throw new Error(
    'No se encontraron los encabezados esperados (TIPO_PLAN, TIPO, DOCUMENTO, NOMBRE1...). ' +
    'Verifique que el archivo use la plantilla Plantilla_Carga_PlanLiga.xlsx.',
  )
}

// Datos ficticios de la fila de ejemplo tal como vienen en Plantilla_Carga_PlanLiga.xlsx. Si el
// usuario la deja intacta (sin borrarla ni editarla, aunque las instrucciones piden borrarla),
// la reconocemos por este contenido exacto y la excluimos: ya sabemos que no es un dato real.
const FILA_EJEMPLO_PLANTILLA: Record<Columna, string> = {
  tipoPlanTexto: 'PLAN FAMILIAR', tipoDocumento: 'CC', documento: '1088123456', nombre1: 'JUAN', nombre2: 'CARLOS',
  apellido1: 'GOMEZ', apellido2: 'RESTREPO', fechaNacimiento: '14/05/1990', sexo: 'M',
  direccion: 'CR 15 # 20-40 APTO 301', ciudad: 'DOSQUEBRADAS', departamento: 'RISARALDA',
  correo: 'juan.gomez@correo.com', telefono: '3101234567', fechaIngreso: '15/01/2026',
  empresa: 'COMERCIALIZADORA XYZ SAS', eps: 'NUEVA EPS', otraEps: '', planSalud: 'MEDICINA PREPAGADA', planNombre: 'PLAN LIGA',
}

/** Solo detecta la fila de ejemplo sin modificar: si el usuario le cambió aunque sea un campo
 * (por ejemplo para reutilizarla como su primer registro real), deja de coincidir y se procesa
 * como dato real, tal como corresponde. */
function esFilaEjemploPlantillaSinModificar(base: Record<Columna, string>): boolean {
  return COLUMNAS.every(c => base[c].trim().toUpperCase() === FILA_EJEMPLO_PLANTILLA[c].toUpperCase())
}

export interface FilaCargaMasiva extends Record<Columna, string> {
  filaExcel: number
  /** Fila sin ningún dato: es un cupo de beneficiario sin usar dentro de un grupo, no un error. */
  vacia: boolean
  erroresFormato: string[]
}

function normalizarFecha(valor: unknown): { valor: string; invalida: boolean } {
  if (valor instanceof Date) {
    const y = valor.getFullYear()
    const m = String(valor.getMonth() + 1).padStart(2, '0')
    const d = String(valor.getDate()).padStart(2, '0')
    return { valor: `${y}-${m}-${d}`, invalida: false }
  }
  const texto = String(valor ?? '').trim()
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

/**
 * Lee el archivo y devuelve una fila por posición física de la hoja (a partir de la primera fila
 * de datos real, detectada dinámicamente tras la fila de encabezados), SIN descartar las filas
 * vacías intermedias: son cupos de beneficiario sin usar, y hace falta conservar su posición para
 * que el agrupamiento en bloques fijos (agruparFilas) no se desalinee. Solo se recortan las filas
 * vacías que quedan después del último dato real del archivo.
 */
export async function parsearArchivoCargaMasiva(file: File): Promise<FilaCargaMasiva[]> {
  const buffer = await file.arrayBuffer()
  const libro = XLSX.read(buffer, { type: 'array', cellDates: true })
  const hoja = libro.Sheets[libro.SheetNames[0]]
  const todasLasFilas = XLSX.utils.sheet_to_json<unknown[]>(hoja, {
    header: 1,
    raw: false,
    dateNF: 'yyyy-mm-dd',
    defval: '',
  })

  const indiceEncabezado = encontrarIndiceEncabezado(todasLasFilas)
  let primeraFilaDatos = indiceEncabezado + 2 // fila 1-based del encabezado (indiceEncabezado + 1) + 1
  let filasCrudas = todasLasFilas.slice(indiceEncabezado + 1)

  let basesPorFila = filasCrudas.map((cruda) => {
    const base = {} as Record<Columna, string>
    COLUMNAS.forEach((campo, i) => { base[campo] = String(cruda[i] ?? '').trim() })
    return base
  })

  if (basesPorFila.length > 0 && esFilaEjemploPlantillaSinModificar(basesPorFila[0])) {
    filasCrudas = filasCrudas.slice(1)
    basesPorFila = basesPorFila.slice(1)
    primeraFilaDatos += 1
  }

  let ultimoIndiceConDatos = -1
  basesPorFila.forEach((base, idx) => {
    if (COLUMNAS.some(c => base[c] !== '')) ultimoIndiceConDatos = idx
  })

  const filas: FilaCargaMasiva[] = []
  for (let idx = 0; idx <= ultimoIndiceConDatos; idx++) {
    const base = basesPorFila[idx] ?? ({} as Record<Columna, string>)
    const filaExcel = primeraFilaDatos + idx
    const vacia = COLUMNAS.every(c => (base[c] ?? '') === '')

    if (vacia) {
      filas.push({ ...base, filaExcel, vacia: true, erroresFormato: [] })
      continue
    }

    const erroresFormato: string[] = []
    const nacimiento = normalizarFecha(base.fechaNacimiento)
    if (nacimiento.invalida) erroresFormato.push(`Fila ${filaExcel}: FECHA_NACIMIENTO no tiene un formato de fecha válido (use DD/MM/AAAA)`)

    const ingreso = normalizarFecha(base.fechaIngreso)
    if (ingreso.invalida) erroresFormato.push(`Fila ${filaExcel}: FECHA_INGRESO no tiene un formato de fecha válido (use DD/MM/AAAA)`)

    const sexo = base.sexo.toUpperCase()
    if (sexo && sexo !== 'M' && sexo !== 'F') erroresFormato.push(`Fila ${filaExcel}: SEXO debe ser M o F`)

    filas.push({
      ...base,
      fechaNacimiento: nacimiento.valor,
      fechaIngreso: ingreso.valor,
      sexo,
      filaExcel,
      vacia: false,
      erroresFormato,
    })
  }
  return filas
}

export interface GrupoCarga {
  titular: FilaCargaMasiva
  beneficiarios: FilaCargaMasiva[]
}

/** Agrupa filas consecutivas por posición: la primera de cada grupo es el titular, las
 * siguientes `cupoBeneficiarios` son sus beneficiarios (algunas pueden venir vacías: cupos sin usar). */
export function agruparFilas(filas: FilaCargaMasiva[], cupoBeneficiarios: number): GrupoCarga[] {
  const grupos: GrupoCarga[] = []
  let i = 0
  while (i < filas.length) {
    grupos.push({ titular: filas[i], beneficiarios: filas.slice(i + 1, i + 1 + cupoBeneficiarios) })
    i += 1 + cupoBeneficiarios
  }
  return grupos
}

const REQUERIDOS_TITULAR: { campo: Columna; etiqueta: string }[] = [
  { campo: 'tipoPlanTexto', etiqueta: 'TIPO_PLAN' },
  { campo: 'tipoDocumento', etiqueta: 'TIPO' },
  { campo: 'documento', etiqueta: 'DOCUMENTO' },
  { campo: 'nombre1', etiqueta: 'NOMBRE1' },
  { campo: 'apellido1', etiqueta: 'APELLIDO1' },
  { campo: 'fechaNacimiento', etiqueta: 'FECHA_NACIMIENTO' },
  { campo: 'sexo', etiqueta: 'SEXO' },
  { campo: 'ciudad', etiqueta: 'CIUDAD' },
  { campo: 'departamento', etiqueta: 'DEPARTAMENTO' },
  { campo: 'fechaIngreso', etiqueta: 'FECHA_INGRESO' },
  { campo: 'eps', etiqueta: 'EPS' },
  { campo: 'planNombre', etiqueta: 'PLAN_NOMBRE' },
]

const REQUERIDOS_BENEFICIARIO: { campo: Columna; etiqueta: string }[] = [
  { campo: 'tipoDocumento', etiqueta: 'TIPO' },
  { campo: 'documento', etiqueta: 'DOCUMENTO' },
  { campo: 'nombre1', etiqueta: 'NOMBRE1' },
  { campo: 'apellido1', etiqueta: 'APELLIDO1' },
  { campo: 'fechaNacimiento', etiqueta: 'FECHA_NACIMIENTO' },
  { campo: 'ciudad', etiqueta: 'CIUDAD' },
  { campo: 'departamento', etiqueta: 'DEPARTAMENTO' },
]

function validarCamposObligatorios(fila: FilaCargaMasiva, requeridos: typeof REQUERIDOS_TITULAR): string[] {
  const faltantes = requeridos.filter(r => !fila[r.campo]).map(r => r.etiqueta)
  if (faltantes.length === 0) return []
  return [`Fila ${fila.filaExcel}: faltan campos obligatorios (${faltantes.join(', ')})`]
}

const SEXO_DESDE_PLANTILLA: Record<string, 'Masculino' | 'Femenino' | ''> = { M: 'Masculino', F: 'Femenino' }

function aTitularDraft(fila: FilaCargaMasiva, tipoPlanId: number | null): TitularDraft {
  return {
    tipoDocumento: fila.tipoDocumento,
    documento: fila.documento,
    nombre: joinNombreCompleto({ nombre1: fila.nombre1, nombre2: fila.nombre2, apellido1: fila.apellido1, apellido2: fila.apellido2 }),
    fechaNacimiento: fila.fechaNacimiento,
    sexo: SEXO_DESDE_PLANTILLA[fila.sexo] ?? '',
    correo: fila.correo,
    telefono: fila.telefono,
    direccion: fila.direccion,
    ciudad: fila.ciudad,
    departamento: fila.departamento,
    empresa: fila.empresa,
    planContratado: '',
    tipoPlanId,
    tipoPlan: fila.tipoPlanTexto,
    tipoAfiliado: '1',
    eps: fila.eps,
    otraEps: fila.otraEps,
    planSalud: fila.planSalud,
    planNombre: fila.planNombre,
    fechaInscripcion: fila.fechaIngreso,
    estado: 'Activo',
  }
}

function aBeneficiarioDraft(fila: FilaCargaMasiva): BeneficiarioDraft {
  return {
    tipoDocumento: fila.tipoDocumento,
    documento: fila.documento,
    nombre: joinNombreCompleto({ nombre1: fila.nombre1, nombre2: fila.nombre2, apellido1: fila.apellido1, apellido2: fila.apellido2 }),
    fechaNacimiento: fila.fechaNacimiento,
    sexo: SEXO_DESDE_PLANTILLA[fila.sexo] ?? '',
    correo: fila.correo,
    telefono: fila.telefono,
    direccion: fila.direccion,
    ciudad: fila.ciudad,
    departamento: fila.departamento,
    empresa: fila.empresa,
    tipoPlan: fila.tipoPlanTexto,
    eps: fila.eps,
    otraEps: fila.otraEps,
    planSalud: fila.planSalud,
    planNombre: fila.planNombre,
    estado: 'Activo',
    fechaInscripcion: '',
  }
}

export interface ResultadoCargaMasiva {
  total: number
  exitosos: number
  errores: number
  detalleErrores: string[]
}

async function buscarIdTitularPorDocumento(documento: string): Promise<number | null> {
  const { items } = await getListadoTitulares({ busqueda: documento, limit: 5 })
  return items.find(t => t.documento === documento)?.id ?? null
}

export async function procesarCargaMasiva(
  filas: FilaCargaMasiva[],
  opciones: { tipoPlanId: number | null; cupoBeneficiarios: number },
  onProgreso?: (hechos: number, total: number) => void,
): Promise<ResultadoCargaMasiva> {
  const grupos = agruparFilas(filas, opciones.cupoBeneficiarios).filter(g => !g.titular.vacia)
  const totalReal = grupos.reduce((sum, g) => sum + 1 + g.beneficiarios.filter(b => !b.vacia).length, 0)
  const detalleErrores: string[] = []
  let exitosos = 0
  let hechos = 0

  for (const grupo of grupos) {
    const beneficiariosReales = grupo.beneficiarios.filter(b => !b.vacia)
    const erroresTitular = [...grupo.titular.erroresFormato, ...validarCamposObligatorios(grupo.titular, REQUERIDOS_TITULAR)]
    if (erroresTitular.length > 0) {
      detalleErrores.push(...erroresTitular)
      if (beneficiariosReales.length > 0) detalleErrores.push(`Fila ${grupo.titular.filaExcel}: no se creó el titular, así que tampoco sus beneficiarios`)
      hechos += 1 + beneficiariosReales.length
      onProgreso?.(hechos, totalReal)
      continue
    }

    try {
      await createTitular(aTitularDraft(grupo.titular, opciones.tipoPlanId))
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${grupo.titular.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear el titular'}`)
      if (beneficiariosReales.length > 0) detalleErrores.push(`Fila ${grupo.titular.filaExcel}: no se procesaron sus beneficiarios porque el titular falló`)
      hechos += 1 + beneficiariosReales.length
      onProgreso?.(hechos, totalReal)
      continue
    }
    hechos += 1
    onProgreso?.(hechos, totalReal)

    if (beneficiariosReales.length === 0) continue

    const idTitular = await buscarIdTitularPorDocumento(grupo.titular.documento)
    if (idTitular === null) {
      detalleErrores.push(`Fila ${grupo.titular.filaExcel}: el titular se creó pero no se pudo ubicar para asociarle sus beneficiarios`)
      hechos += beneficiariosReales.length
      onProgreso?.(hechos, totalReal)
      continue
    }

    for (const filaBene of beneficiariosReales) {
      const erroresBene = [...filaBene.erroresFormato, ...validarCamposObligatorios(filaBene, REQUERIDOS_BENEFICIARIO)]
      if (erroresBene.length > 0) {
        detalleErrores.push(...erroresBene)
        hechos += 1
        onProgreso?.(hechos, totalReal)
        continue
      }
      try {
        await createBeneficiario(idTitular, aBeneficiarioDraft(filaBene))
        exitosos += 1
      } catch (e) {
        detalleErrores.push(`Fila ${filaBene.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear el beneficiario'}`)
      }
      hechos += 1
      onProgreso?.(hechos, totalReal)
    }
  }

  return { total: totalReal, exitosos, errores: detalleErrores.length, detalleErrores }
}
