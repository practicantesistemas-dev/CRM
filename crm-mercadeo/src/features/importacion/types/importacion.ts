export type TipoArchivo = 'Excel' | 'CSV'
export type EstadoImportacion = 'Completado' | 'Con errores' | 'En proceso'
export type TipoImportacion = 'contactos' | 'empresas' | 'proveedores'

export interface RegistroImportacion {
  id: number
  archivo: string
  tipo: TipoArchivo
  fecha: string
  registros: number
  exitosos: number
  duplicados: number
  errores: number
  estado: EstadoImportacion
}

export interface ResultadoImportacion {
  registros: number
  exitosos: number
  duplicados: number
  errores: number
}
