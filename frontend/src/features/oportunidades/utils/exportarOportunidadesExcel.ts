import * as XLSX from 'xlsx'
import type { Oportunidad } from '../types/oportunidad'
import { clienteLabel } from '../constants/oportunidades.constants'

function sanitizarNombreArchivo(filtro: string): string {
  return filtro
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 50)
}

const TIPO_CLIENTE_LABEL: Record<Oportunidad['tipoCliente'], string> = {
  empresa: 'Empresa', contacto: 'Contacto', titular: 'Titular Plan Liga',
}

export function exportarOportunidadesExcel(
  oportunidades: Oportunidad[],
  filtroBuscar = '',
  filtroEstado = 'todos',
  filtroResponsable = 'todos',
): void {
  const filas = oportunidades.map(o => ({
    'Cliente': clienteLabel(o),
    'Tipo de cliente': TIPO_CLIENTE_LABEL[o.tipoCliente],
    'Servicio': o.servicio,
    'Etapa': o.estado,
    'Responsable': o.responsable,
    'Valor': o.valor,
    'Probabilidad': `${o.probabilidad}%`,
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [
    { wch: 28 }, // Cliente
    { wch: 16 }, // Tipo de cliente
    { wch: 22 }, // Servicio
    { wch: 16 }, // Etapa
    { wch: 20 }, // Responsable
    { wch: 14 }, // Valor
    { wch: 12 }, // Probabilidad
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Oportunidades')
  const fecha = new Date().toISOString().split('T')[0]

  const partes: string[] = []
  const buscarSafe = sanitizarNombreArchivo(filtroBuscar)
  const etapaSafe = sanitizarNombreArchivo(filtroEstado)
  const responsableSafe = sanitizarNombreArchivo(filtroResponsable)

  if (buscarSafe) partes.push(`busqueda_${buscarSafe}`)
  if (etapaSafe && filtroEstado !== 'todos') partes.push(`etapa_${etapaSafe}`)
  if (responsableSafe && filtroResponsable !== 'todos') partes.push(`responsable_${responsableSafe}`)

  const sufijoFiltro = partes.length ? `_${partes.join('_')}` : ''
  XLSX.writeFile(libro, `oportunidades${sufijoFiltro}_${fecha}.xlsx`)
}
