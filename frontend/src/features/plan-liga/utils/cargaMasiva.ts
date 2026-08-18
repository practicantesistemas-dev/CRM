import * as XLSX from 'xlsx'
import { joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import { TIPOS_DOCUMENTO } from '@/shared/constants/tiposDocumento'
import { resolverUbicacion } from '@/shared/utils/resolverUbicacion'
import type { Departamento, Municipio } from '@/shared/types/ubicaciones'
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

export function normalizarFecha(valor: unknown): { valor: string; invalida: boolean } {
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
export async function parsearArchivoCargaMasiva(
  file: File,
  catalogoUbicaciones: { departamentos: Departamento[]; municipios: Municipio[] },
): Promise<FilaCargaMasiva[]> {
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

    const tipoDocumento = base.tipoDocumento.toUpperCase()
    if (tipoDocumento && !(TIPOS_DOCUMENTO as readonly string[]).includes(tipoDocumento)) {
      erroresFormato.push(`Fila ${filaExcel}: TIPO no es un tipo de documento válido (use uno de: ${TIPOS_DOCUMENTO.join(', ')})`)
    }

    // CIUDAD/DEPARTAMENTO en la plantilla vienen como texto libre; se resuelven contra el
    // catálogo real (mismas reglas que en Contactos: exacto, si no el más parecido, si no hay
    // ni una coincidencia razonable esta fila queda con error de formato y no se procesa). Esto
    // solo agrega errores al mismo arreglo `erroresFormato` que ya usan SEXO/TIPO/fechas, así
    // que el agrupamiento por posición fija (agruparFilas) y el resto de procesarCargaMasiva no
    // cambian en nada: siguen viendo "esta fila tiene errores" igual que antes.
    const ubicacion = resolverUbicacion(base.departamento, base.ciudad, catalogoUbicaciones.departamentos, catalogoUbicaciones.municipios)
    ubicacion.errores.forEach(e => erroresFormato.push(`Fila ${filaExcel}: ${e}`))

    filas.push({
      ...base,
      fechaNacimiento: nacimiento.valor,
      fechaIngreso: ingreso.valor,
      sexo,
      tipoDocumento,
      departamento: ubicacion.departamentoCodigo || base.departamento,
      ciudad: ubicacion.municipioCodigo || base.ciudad,
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

/**
 * Agrupa filas consecutivas por posición: la primera de cada grupo es el titular; las que
 * siguen son sus beneficiarios, hasta un máximo de `cupoBeneficiarios`. El cupo es un TOPE, no
 * una cantidad obligatoria: en cuanto aparece una fila vacía se corta ahí la lista de ese
 * titular (no hace falta rellenar hasta completar el cupo). Cualquier cantidad de filas vacías
 * que sigan se ignoran por completo — no ocupan lugar ni cuentan para nada — hasta encontrar la
 * siguiente fila con datos, que es el próximo titular.
 * Nota: si un titular usa MENOS beneficiarios que el cupo, el archivo debe dejar al menos 1 fila
 * vacía después del último beneficiario real antes del siguiente titular (si no, esa fila se
 * interpretaría como otro beneficiario de este mismo titular en vez del siguiente titular).
 */
export function agruparFilas(filas: FilaCargaMasiva[], cupoBeneficiarios: number): GrupoCarga[] {
  const grupos: GrupoCarga[] = []
  let i = 0
  while (i < filas.length) {
    const beneficiarios: FilaCargaMasiva[] = []
    let j = i + 1
    while (j < filas.length && beneficiarios.length < cupoBeneficiarios && !filas[j].vacia) {
      beneficiarios.push(filas[j])
      j++
    }
    grupos.push({ titular: filas[i], beneficiarios })
    while (j < filas.length && filas[j].vacia) j++ // saltar filas vacías sin contarlas
    i = j
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
    factura: '',
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

/** Validación de formato sin tocar el backend: recorre los mismos grupos que procesarCargaMasiva
 * pero sin crear nada, para bloquear la importación completa antes de ejecutar ninguna acción
 * si el archivo trae datos inválidos u obligatorios faltantes. */
export function validarGruposCargaMasiva(grupos: GrupoCarga[]): string[] {
  const errores: string[] = []
  for (const grupo of grupos) {
    const beneficiariosReales = grupo.beneficiarios.filter(b => !b.vacia)
    const erroresTitular = [...grupo.titular.erroresFormato, ...validarCamposObligatorios(grupo.titular, REQUERIDOS_TITULAR)]
    if (erroresTitular.length > 0) {
      errores.push(...erroresTitular)
      if (beneficiariosReales.length > 0) {
        errores.push(
          `Fila ${grupo.titular.filaExcel}: no se creará el titular, así que tampoco sus ${beneficiariosReales.length} beneficiario(s) `
          + `(filas ${beneficiariosReales[0].filaExcel}-${beneficiariosReales[beneficiariosReales.length - 1].filaExcel}). `
          + `El grupo del siguiente titular no se ve afectado.`,
        )
      }
      continue
    }
    beneficiariosReales.forEach((filaBene, posicion) => {
      const erroresBene = [...filaBene.erroresFormato, ...validarCamposObligatorios(filaBene, REQUERIDOS_BENEFICIARIO)]
      if (erroresBene.length === 0) return
      errores.push(
        `Fila ${filaBene.filaExcel} (beneficiario ${posicion + 1} de ${beneficiariosReales.length} del titular `
        + `${grupo.titular.documento} en fila ${grupo.titular.filaExcel}): ${erroresBene.join('; ')}`,
      )
    })
  }
  return errores
}

export async function buscarIdTitularPorDocumento(documento: string): Promise<number | null> {
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

  // Cada grupo (titular + hasta `cupoBeneficiarios` filas debajo) ya viene delimitado por
  // posición fija desde `agruparFilas`, calculado ANTES de procesar nada: si algo falla a mitad
  // de un grupo, el límite de ese grupo no se corre ni se recalcula, así que jamás se toma una
  // fila de otro titular como si fuera un beneficiario de este. Un titular que falla se salta
  // por completo (no se crea ninguno de sus beneficiarios); un beneficiario que falla solo se
  // reporta y se sigue con el siguiente beneficiario DE ESE MISMO grupo, sin tocar otros grupos.
  for (const grupo of grupos) {
    const beneficiariosReales = grupo.beneficiarios.filter(b => !b.vacia)
    const refGrupo = `titular ${grupo.titular.documento} en fila ${grupo.titular.filaExcel}`
    const erroresTitular = [...grupo.titular.erroresFormato, ...validarCamposObligatorios(grupo.titular, REQUERIDOS_TITULAR)]
    if (erroresTitular.length > 0) {
      detalleErrores.push(...erroresTitular)
      if (beneficiariosReales.length > 0) {
        detalleErrores.push(
          `Fila ${grupo.titular.filaExcel}: no se creó el titular, así que tampoco sus ${beneficiariosReales.length} beneficiario(s) `
          + `(filas ${beneficiariosReales[0].filaExcel}-${beneficiariosReales[beneficiariosReales.length - 1].filaExcel}). `
          + `El grupo del siguiente titular se procesa aparte, sin verse afectado.`,
        )
      }
      hechos += 1 + beneficiariosReales.length
      onProgreso?.(hechos, totalReal)
      continue
    }

    try {
      await createTitular(aTitularDraft(grupo.titular, opciones.tipoPlanId))
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${grupo.titular.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear el titular'}`)
      if (beneficiariosReales.length > 0) {
        detalleErrores.push(
          `Fila ${grupo.titular.filaExcel}: no se procesaron sus ${beneficiariosReales.length} beneficiario(s) `
          + `(filas ${beneficiariosReales[0].filaExcel}-${beneficiariosReales[beneficiariosReales.length - 1].filaExcel}) `
          + `porque el titular falló; se salta este grupo completo y se sigue con el siguiente titular del archivo.`,
        )
      }
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

    for (const [posicion, filaBene] of beneficiariosReales.entries()) {
      const refBene = `Fila ${filaBene.filaExcel} (beneficiario ${posicion + 1} de ${beneficiariosReales.length} del ${refGrupo})`
      const erroresBene = [...filaBene.erroresFormato, ...validarCamposObligatorios(filaBene, REQUERIDOS_BENEFICIARIO)]
      if (erroresBene.length > 0) {
        detalleErrores.push(`${refBene}: ${erroresBene.join('; ')}`)
        hechos += 1
        onProgreso?.(hechos, totalReal)
        continue
      }
      try {
        await createBeneficiario(idTitular, aBeneficiarioDraft(filaBene))
        exitosos += 1
      } catch (e) {
        detalleErrores.push(`${refBene}: ${e instanceof Error ? e.message : 'no se pudo crear el beneficiario'} `
          + `(no afecta a los demás beneficiarios de este titular ni a otros grupos)`)
      }
      hechos += 1
      onProgreso?.(hechos, totalReal)
    }
  }

  return { total: totalReal, exitosos, errores: detalleErrores.length, detalleErrores }
}
