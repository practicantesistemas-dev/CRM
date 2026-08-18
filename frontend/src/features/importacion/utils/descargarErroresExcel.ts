import * as XLSX from 'xlsx'

export function descargarErroresExcel(detalleErrores: string[], nombreArchivoOrigen: string): void {
  const filas = detalleErrores.map(mensaje => ({ 'Error': mensaje }))
  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [{ wch: 100 }]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Errores')
  const base = nombreArchivoOrigen.replace(/\.[^.]+$/, '')
  XLSX.writeFile(libro, `errores_${base}.xlsx`)
}
