import type { Departamento, Municipio } from '../types/ubicaciones'

const API_URL = import.meta.env.VITE_CRM_API_URL

interface DepartamentoResponse {
  CODIGO: string
  NOMBRE: string
}

interface MunicipioResponse {
  CODIGO: string
  NOMBRE: string
  DEPARTAMENTO_CODIGO: string
  DEPARTAMENTO_NOMBRE: string
}

export async function getDepartamentos(): Promise<Departamento[]> {
  const response = await fetch(`${API_URL}/api/compartidos/ubicaciones/departamentos`)
  if (!response.ok) throw new Error('No se pudo cargar la lista de departamentos.')
  const data: DepartamentoResponse[] = await response.json()
  return data.map(d => ({ codigo: d.CODIGO, nombre: d.NOMBRE }))
}

// El CODIGO que trae este endpoint viene con el código del departamento pegado al inicio
// (ej. "91263" = depto "91" + municipio "263"), no el código propio del municipio. Se quita
// ese prefijo para quedarnos con el código que realmente se debe guardar en CIUDAD.
export async function getMunicipios(): Promise<Municipio[]> {
  const response = await fetch(`${API_URL}/api/compartidos/ubicaciones/municipios`)
  if (!response.ok) throw new Error('No se pudo cargar la lista de municipios.')
  const data: MunicipioResponse[] = await response.json()
  return data.map(m => ({
    codigo: m.CODIGO.startsWith(m.DEPARTAMENTO_CODIGO) ? m.CODIGO.slice(m.DEPARTAMENTO_CODIGO.length) : m.CODIGO,
    nombre: m.NOMBRE,
    departamentoCodigo: m.DEPARTAMENTO_CODIGO,
    departamentoNombre: m.DEPARTAMENTO_NOMBRE,
  }))
}
