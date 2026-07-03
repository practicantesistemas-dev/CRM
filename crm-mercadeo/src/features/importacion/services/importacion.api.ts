import type { RegistroImportacion, ResultadoImportacion } from '../types/importacion'
import { HISTORIAL_MOCK } from '../constants/importacion.constants'

let historial: RegistroImportacion[] = [...HISTORIAL_MOCK]

export function getHistorial(): RegistroImportacion[] {
  return historial
}

export function procesarArchivo(archivo: File): Promise<RegistroImportacion> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = Math.floor(Math.random() * 200) + 50
      const duplicados = Math.floor(total * 0.05)
      const errores = Math.floor(total * 0.02)
      const resultado: ResultadoImportacion = { registros: total, exitosos: total - duplicados - errores, duplicados, errores }

      const registro: RegistroImportacion = {
        id: Date.now(),
        archivo: archivo.name,
        tipo: archivo.name.endsWith('.csv') ? 'CSV' : 'Excel',
        fecha: new Date().toISOString().split('T')[0],
        ...resultado,
        estado: errores > 0 ? 'Con errores' : 'Completado',
      }
      historial = [registro, ...historial]
      resolve(registro)
    }, 1800)
  })
}
