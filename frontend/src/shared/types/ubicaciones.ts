export interface Departamento {
  codigo: string
  nombre: string
}

export interface Municipio {
  /** Código propio del municipio, ya sin el prefijo del departamento (ver ubicaciones.api.ts). */
  codigo: string
  nombre: string
  departamentoCodigo: string
  departamentoNombre: string
}
