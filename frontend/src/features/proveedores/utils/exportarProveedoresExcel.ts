import * as XLSX from 'xlsx'
import type { Proveedor } from '../types/proveedor'

function sanitizarNombreArchivo(filtro: string): string {
  const safe = filtro
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 50)

  return safe
}

export function exportarProveedoresExcel(
  proveedores: Proveedor[],
  filtroNombre = '',
  filtroEstado = 'todos',
  filtroCategoria = 'todas',
): void {
  const filas = proveedores.map(p => ({
    Nombre: p.nombre,
    Categoría: p.categoria,
    NIT: p.nit,
    Correo: p.correo,
    Teléfono: p.telefono,
    Estado: p.estado,
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [
    { wch: 28 }, // Nombre
    { wch: 18 }, // Categoría
    { wch: 18 }, // NIT
    { wch: 24 }, // Correo
    { wch: 16 }, // Teléfono
    { wch: 12 }, // Estado
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Proveedores')
  const fecha = new Date().toISOString().split('T')[0]

  const partes: string[] = []
  const nombreSafe = sanitizarNombreArchivo(filtroNombre)
  const estadoSafe = sanitizarNombreArchivo(filtroEstado)
  const categoriaSafe = sanitizarNombreArchivo(filtroCategoria)

  if (nombreSafe) partes.push(`nombre_${nombreSafe}`)
  if (estadoSafe && filtroEstado !== 'todos') partes.push(`estado_${estadoSafe}`)
  if (categoriaSafe && filtroCategoria !== 'todas') partes.push(`categoria_${categoriaSafe}`)

  const sufijoFiltro = partes.length ? `_${partes.join('_')}` : ''
  XLSX.writeFile(libro, `proveedores${sufijoFiltro}_${fecha}.xlsx`)
}
