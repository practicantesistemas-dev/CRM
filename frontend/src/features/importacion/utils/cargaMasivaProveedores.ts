import type { ProveedorDraft } from '@/features/proveedores/types/proveedor'
import { createProveedor } from '@/features/proveedores/services/proveedores.api'
import { nit, nombreEntidad, optionalEmail, telefonoCO } from '@/shared/utils/zodHelpers'
import type { FilaPlantilla } from './leerHoja'
import type { ResultadoImportacion } from '../types/importacion'

function estadoDesde(valor: string): ProveedorDraft['estado'] {
  const v = valor.trim().toLowerCase()
  return v === 'inactivo' || v === 'no' || v === '0' ? 'Inactivo' : 'Activo'
}

// Mismas reglas de formato que el formulario manual de Proveedores (proveedor.schema.ts).
function validarFormatoProveedor(v: Record<string, string>): { errores: string[]; nombre: string; nit: string; correo: string; telefono: string } {
  const errores: string[] = []

  const resNombre = nombreEntidad({ message: 'mín. 3 caracteres, no solo números o símbolos' }).safeParse(v['NOMBRE'] ?? '')
  if (!resNombre.success) errores.push(`NOMBRE "${v['NOMBRE']}" inválido: ${resNombre.error.issues[0].message}`)

  const resNit = nit({ opcional: true }).safeParse(v['NIT'] ?? '')
  if (!resNit.success) errores.push(`NIT "${v['NIT']}" inválido: ${resNit.error.issues[0].message}`)

  const resCorreo = optionalEmail().safeParse(v['CORREO'] ?? '')
  if (!resCorreo.success) errores.push(`CORREO "${v['CORREO']}" inválido: ${resCorreo.error.issues[0].message}`)

  const resTelefono = telefonoCO().safeParse(v['TELEFONO'] ?? '')
  if (!resTelefono.success) errores.push(`TELEFONO "${v['TELEFONO']}" inválido: ${resTelefono.error.issues[0].message}`)

  return {
    errores,
    nombre: resNombre.success ? resNombre.data : (v['NOMBRE'] ?? ''),
    nit: resNit.success ? resNit.data : (v['NIT'] ?? ''),
    correo: resCorreo.success ? resCorreo.data : (v['CORREO'] ?? ''),
    telefono: resTelefono.success ? resTelefono.data : (v['TELEFONO'] ?? ''),
  }
}

export async function procesarCargaMasivaProveedores(
  filas: FilaPlantilla[],
  onProgreso?: (hechos: number, total: number) => void,
): Promise<ResultadoImportacion> {
  const detalleErrores: string[] = []
  let exitosos = 0

  for (const [idx, fila] of filas.entries()) {
    const v = fila.valores

    if (!(v['NOMBRE'] ?? '')) {
      detalleErrores.push(`Fila ${fila.filaExcel}: falta NOMBRE (obligatorio)`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const { errores: erroresFormato, nombre, nit: nitValidado, correo, telefono } = validarFormatoProveedor(v)
    if (erroresFormato.length > 0) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${erroresFormato.join('; ')}`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const draft: ProveedorDraft = {
      nombre,
      categoria: v['CATEGORIA'] ?? '',
      nit: nitValidado,
      correo,
      telefono,
      estado: estadoDesde(v['ESTADO'] ?? ''),
    }

    try {
      await createProveedor(draft)
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear el proveedor'}`)
    }
    onProgreso?.(idx + 1, filas.length)
  }

  return { registros: filas.length, exitosos, errores: detalleErrores.length, detalleErrores, avisos: [] }
}
