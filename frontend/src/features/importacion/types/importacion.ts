export type TipoArchivo = 'Excel' | 'CSV'
export type EstadoImportacion = 'Completado' | 'Con errores'
export type TipoImportacion = 'contactos' | 'empresas' | 'proveedores'

export interface RegistroImportacion {
  id: number
  archivo: string
  tipo: TipoArchivo
  tipoImportacion: TipoImportacion
  fecha: string
  registros: number
  exitosos: number
  errores: number
  estado: EstadoImportacion
  /** Quién hizo la importación (persistido en mercadeo_crm_importaciones). */
  usuario: string
  /** Filas que no se pudieron crear, para el reporte descargable. Solo disponible para
   * importaciones hechas en esta sesión: el detalle fila por fila no se persiste en el
   * backend, así que el historial cargado de sesiones anteriores llega con esto vacío. */
  detalleErrores: string[]
  /** Filas creadas igual, pero con alguna observación (ej. empresa/ciudad sin coincidencia). */
  avisos: string[]
}

export interface ResultadoImportacion {
  registros: number
  exitosos: number
  errores: number
  detalleErrores: string[]
  avisos: string[]
}
