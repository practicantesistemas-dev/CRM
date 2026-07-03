import type { EstadoImportacion, RegistroImportacion } from '../types/importacion'

export const HISTORIAL_MOCK: RegistroImportacion[] = [
  { id: 1, archivo: 'contactos_junio_2026.xlsx', tipo: 'Excel', fecha: '2026-06-25', registros: 248, exitosos: 231, duplicados: 12, errores: 5, estado: 'Con errores' },
  { id: 2, archivo: 'empresas_bogota.csv', tipo: 'CSV', fecha: '2026-06-18', registros: 56, exitosos: 54, duplicados: 2, errores: 0, estado: 'Completado' },
  { id: 3, archivo: 'prospectos_mayo.xlsx', tipo: 'Excel', fecha: '2026-05-30', registros: 312, exitosos: 298, duplicados: 14, errores: 0, estado: 'Completado' },
  { id: 4, archivo: 'contactos_cali_q2.csv', tipo: 'CSV', fecha: '2026-05-15', registros: 89, exitosos: 81, duplicados: 6, errores: 2, estado: 'Con errores' },
]

export const TIPOS_IMPORTACION = ['contactos', 'empresas', 'proveedores'] as const

export const estadoStyle = (e: EstadoImportacion) => {
  if (e === 'Completado')  return 'text-emerald-600'
  if (e === 'Con errores') return 'text-amber-600'
  return 'text-[#1E3A8A]'
}
