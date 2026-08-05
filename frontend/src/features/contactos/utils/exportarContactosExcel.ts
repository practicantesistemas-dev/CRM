import * as XLSX from 'xlsx'
import type { Contacto } from '../types/contacto'

// Las columnas más consultadas al trabajar un contacto (nombre, teléfono, correo, empresa) van
// primero para que queden visibles sin desplazar la hoja; el resto es contexto secundario.
// La librería "xlsx" (edición community) no soporta escribir estilos (negrita/color) en el
// archivo generado, así que el énfasis se logra con el orden de columnas, no con formato visual.
export function exportarContactosExcel(contactos: Contacto[]): void {
  const filas = contactos.map(c => ({
    'Nombre': c.nombre,
    'Teléfono': c.telefono,
    'Correo': c.correo,
    'Empresa': c.empresa,
    'Cargo': c.cargo,
    'Tipo de documento': c.tipoDocumento,
    'Número de documento': c.documento,
    'Ciudad': c.ciudad,
    'Departamento': c.departamento,
    'Estado': c.estado,
    'Tipo de contacto': c.tipoContacto,
    'Etiquetas': c.etiquetas.map(e => e.nombre).join(', '),
    'Responsable': c.responsable,
    'Fecha de nacimiento': c.fechaNacimiento,
    'Sexo': c.sexo,
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [
    { wch: 28 }, { wch: 15 }, { wch: 28 }, { wch: 24 }, { wch: 18 },
    { wch: 14 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 12 },
    { wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 16 }, { wch: 10 },
  ]

  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Contactos')
  XLSX.writeFile(libro, `contactos_${new Date().toISOString().split('T')[0]}.xlsx`)
}
