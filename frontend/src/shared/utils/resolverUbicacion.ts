import type { Departamento, Municipio } from '@/shared/types/ubicaciones'

/** minúsculas, sin espacios sobrantes, sin tildes — para comparar nombres de lugar. */
export function normalizarTexto(s: string): string {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Distancia de edición (Levenshtein): cuántos cambios de letra separan dos textos. */
function distanciaLevenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const fila = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    let anterior = fila[0]
    fila[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = fila[j]
      fila[j] = a[i - 1] === b[j - 1] ? anterior : 1 + Math.min(anterior, fila[j], fila[j - 1])
      anterior = temp
    }
  }
  return fila[n]
}

/** 1 = idénticos, 0 = completamente distintos. Ambos textos ya deben venir normalizados. */
export function similitud(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - distanciaLevenshtein(a, b) / maxLen
}

// Por debajo de esto ya no se considera "el más parecido": es otro lugar distinto, no un
// typo/tilde/mayúscula del mismo nombre. 0.65 tolera errores de tipeo típicos en nombres de
// ciudad cortos (ej. "Peryra" -> "Pereira", 2 letras distintas de 7) pero sigue rechazando
// nombres genuinamente distintos.
const UMBRAL_SIMILITUD = 0.65

function mejorCoincidencia<T>(
  nombreNormalizado: string,
  candidatos: T[],
  extraerNombre: (item: T) => string,
): { item: T; similitud: number } | null {
  let mejor: { item: T; similitud: number } | null = null
  for (const candidato of candidatos) {
    const s = similitud(nombreNormalizado, normalizarTexto(extraerNombre(candidato)))
    if (!mejor || s > mejor.similitud) mejor = { item: candidato, similitud: s }
  }
  return mejor && mejor.similitud >= UMBRAL_SIMILITUD ? mejor : null
}

export interface ResolucionUbicacion {
  /** Código DIVIPOLA del departamento, o '' si no se dio nombre o no se pudo resolver. */
  departamentoCodigo: string
  /** Código DIVIPOLA del municipio, o '' si no se dio nombre o no se pudo resolver. */
  municipioCodigo: string
  /** true si el código de departamento salió de la coincidencia más parecida, no de una exacta. */
  departamentoAproximado: boolean
  /** true si el código de municipio salió de la coincidencia más parecida, no de una exacta. */
  municipioAproximado: boolean
  /** Un mensaje por cada nombre (departamento y/o ciudad) que no coincidió ni exacta ni
   * aproximadamente con el catálogo. Vacío si todo lo que se dio se pudo resolver. */
  errores: string[]
}

/**
 * Convierte nombres de departamento/ciudad (texto libre, como los escribe alguien en un Excel)
 * a sus códigos DIVIPOLA, comparando contra el catálogo real de ubicaciones
 * (useUbicaciones/GET /api/compartidos/ubicaciones). Reglas, en este orden:
 *   1. Coincidencia exacta (ignorando mayúsculas/tildes/espacios) -> ese código.
 *   2. Si no hay exacta, la más parecida por distancia de edición, solo si supera el umbral
 *      de similitud -> ese código (con `*Aproximado: true` para poder avisarlo).
 *   3. Si ni siquiera hay una parecida razonable, o el nombre no existe en el catálogo ->
 *      no se pone código y se agrega un mensaje a `errores` (quien llama decide qué hacer:
 *      en general, no procesar esa fila/registro).
 * Un nombre vacío (departamento o ciudad no diligenciados) no es un error: simplemente no
 * se resuelve nada para ese campo.
 */
export function resolverUbicacion(
  nombreDepartamentoCrudo: string,
  nombreCiudadCrudo: string,
  departamentos: Departamento[],
  municipios: Municipio[],
): ResolucionUbicacion {
  const errores: string[] = []
  const nombreDepartamento = nombreDepartamentoCrudo.trim()
  const nombreCiudad = nombreCiudadCrudo.trim()

  let departamentoCodigo = ''
  let departamentoAproximado = false
  let departamentoResuelto: Departamento | undefined

  if (nombreDepartamento) {
    const depNorm = normalizarTexto(nombreDepartamento)
    departamentoResuelto = departamentos.find(d => normalizarTexto(d.nombre) === depNorm)
    if (departamentoResuelto) {
      departamentoCodigo = departamentoResuelto.codigo
    } else {
      const aproximado = mejorCoincidencia(depNorm, departamentos, d => d.nombre)
      if (aproximado) {
        departamentoResuelto = aproximado.item
        departamentoCodigo = aproximado.item.codigo
        departamentoAproximado = true
      } else {
        errores.push(`DEPARTAMENTO "${nombreDepartamento}" no coincide (ni exacta ni aproximadamente) con ningún departamento del catálogo`)
      }
    }
  }

  let municipioCodigo = ''
  let municipioAproximado = false

  if (nombreCiudad) {
    const ciudadNorm = normalizarTexto(nombreCiudad)
    // Primero solo dentro del departamento ya resuelto (evita confundir ciudades homónimas de
    // otro departamento); si ahí no aparece, se busca en todo el país como respaldo.
    const enDepartamento = departamentoResuelto
      ? municipios.filter(m => m.departamentoCodigo === departamentoResuelto!.codigo)
      : []

    const exacto = enDepartamento.find(m => normalizarTexto(m.nombre) === ciudadNorm)
      ?? municipios.find(m => normalizarTexto(m.nombre) === ciudadNorm)

    if (exacto) {
      municipioCodigo = exacto.codigo
    } else {
      const aproximado = (enDepartamento.length ? mejorCoincidencia(ciudadNorm, enDepartamento, m => m.nombre) : null)
        ?? mejorCoincidencia(ciudadNorm, municipios, m => m.nombre)
      if (aproximado) {
        municipioCodigo = aproximado.item.codigo
        municipioAproximado = true
      } else {
        errores.push(`CIUDAD "${nombreCiudad}" no coincide (ni exacta ni aproximadamente) con ningún municipio del catálogo`)
      }
    }
  }

  return { departamentoCodigo, municipioCodigo, departamentoAproximado, municipioAproximado, errores }
}
