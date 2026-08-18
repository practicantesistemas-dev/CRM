import type { EstadoImportacion } from '../types/importacion'

export const TIPOS_IMPORTACION = ['contactos', 'empresas', 'proveedores'] as const

export const estadoStyle = (e: EstadoImportacion) =>
  e === 'Completado' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
