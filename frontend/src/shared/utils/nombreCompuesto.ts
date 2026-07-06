export interface NombreCompuesto {
  nombre1: string
  nombre2: string
  apellido1: string
  apellido2: string
}

const VACIO: NombreCompuesto = { nombre1: '', nombre2: '', apellido1: '', apellido2: '' }

/**
 * Divide un nombre completo en sus partes. Con 3 palabras asume la convención más común
 * en Colombia (un nombre + dos apellidos); con 4 o más, dos nombres + dos apellidos.
 */
export function splitNombreCompleto(full: string): NombreCompuesto {
  const palabras = full.trim().split(/\s+/).filter(Boolean)
  if (palabras.length === 0) return { ...VACIO }
  if (palabras.length === 1) return { ...VACIO, nombre1: palabras[0] }
  if (palabras.length === 2) return { ...VACIO, nombre1: palabras[0], apellido1: palabras[1] }
  if (palabras.length === 3) return { nombre1: palabras[0], nombre2: '', apellido1: palabras[1], apellido2: palabras[2] }
  return { nombre1: palabras[0], nombre2: palabras[1], apellido1: palabras[2], apellido2: palabras.slice(3).join(' ') }
}

export function joinNombreCompleto(partes: NombreCompuesto): string {
  return [partes.nombre1, partes.nombre2, partes.apellido1, partes.apellido2]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ')
}
