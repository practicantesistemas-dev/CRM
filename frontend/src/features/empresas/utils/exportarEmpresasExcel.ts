import * as XLSX from 'xlsx'
import type { Empresa } from '../types/empresa'

function sanitizarNombreArchivo(filtro: string): string {
  return filtro
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 50)
}

export function exportarEmpresasExcel(
  empresas: Empresa[],
  filtroBuscar = '',
  filtroEstado = 'todos',
  filtroIndustria = 'todas',
): void {
  const filas = empresas.map(e => ({
    'Razón Social': e.razonSocial,
    'NIT': e.nit,
    'Industria': e.industria,
    'Dirección': e.direccion,
    'Ciudad': e.ciudad,
    'Estado': e.estado ? 'Activa' : 'Inactiva',
    'Contactos': e.contactos,
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [
    { wch: 30 }, // Razón Social
    { wch: 18 }, // NIT
    { wch: 20 }, // Industria
    { wch: 26 }, // Dirección
    { wch: 16 }, // Ciudad
    { wch: 12 }, // Estado
    { wch: 12 }, // Contactos
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Empresas')
  const fecha = new Date().toISOString().split('T')[0]

  const partes: string[] = []
  const buscarSafe = sanitizarNombreArchivo(filtroBuscar)
  const estadoSafe = sanitizarNombreArchivo(filtroEstado)
  const industriaSafe = sanitizarNombreArchivo(filtroIndustria)

  if (buscarSafe) partes.push(`busqueda_${buscarSafe}`)
  if (estadoSafe && filtroEstado !== 'todos') partes.push(`estado_${estadoSafe}`)
  if (industriaSafe && filtroIndustria !== 'todas') partes.push(`industria_${industriaSafe}`)

  const sufijoFiltro = partes.length ? `_${partes.join('_')}` : ''
  XLSX.writeFile(libro, `empresas${sufijoFiltro}_${fecha}.xlsx`)
}
