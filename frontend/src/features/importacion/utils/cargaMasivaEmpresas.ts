import type { EmpresaDraft } from '@/features/empresas/types/empresa'
import { createEmpresa } from '@/features/empresas/services/empresas.api'
import { nit, nombreEntidad } from '@/shared/utils/zodHelpers'
import type { FilaPlantilla } from './leerHoja'
import type { ResultadoImportacion } from '../types/importacion'

const normalizar = (s: string) => s.trim().toLowerCase()

function estadoDesde(valor: string): boolean {
  const v = normalizar(valor)
  if (v === 'inactiva' || v === 'inactivo' || v === 'no' || v === '0') return false
  return true
}

// Mismas reglas de formato que el formulario manual de Empresas (empresa.schema.ts). El NIT
// queda opcional para la carga masiva (a diferencia del formulario, que lo exige): en el CRM
// ya existen empresas reales sin NIT, importadas desde Plan Liga (ver comentario en Empresa.nit).
function validarFormatoEmpresa(v: Record<string, string>): { errores: string[]; razonSocial: string; nit: string } {
  const errores: string[] = []

  const resRazonSocial = nombreEntidad({ message: 'mín. 3 caracteres, no solo números o símbolos' }).safeParse(v['RAZON_SOCIAL'] ?? '')
  if (!resRazonSocial.success) errores.push(`RAZON_SOCIAL "${v['RAZON_SOCIAL']}" inválida: ${resRazonSocial.error.issues[0].message}`)

  const resNit = nit({ opcional: true }).safeParse(v['NIT'] ?? '')
  if (!resNit.success) errores.push(`NIT "${v['NIT']}" inválido: ${resNit.error.issues[0].message}`)

  return {
    errores,
    razonSocial: resRazonSocial.success ? resRazonSocial.data : (v['RAZON_SOCIAL'] ?? ''),
    nit: resNit.success ? resNit.data : (v['NIT'] ?? ''),
  }
}

export async function procesarCargaMasivaEmpresas(
  filas: FilaPlantilla[],
  onProgreso?: (hechos: number, total: number) => void,
): Promise<ResultadoImportacion> {
  const detalleErrores: string[] = []
  let exitosos = 0

  for (const [idx, fila] of filas.entries()) {
    const v = fila.valores

    if (!(v['RAZON_SOCIAL'] ?? '')) {
      detalleErrores.push(`Fila ${fila.filaExcel}: falta RAZON_SOCIAL (obligatorio)`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const { errores: erroresFormato, razonSocial, nit: nitValidado } = validarFormatoEmpresa(v)
    if (erroresFormato.length > 0) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${erroresFormato.join('; ')}`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const draft: EmpresaDraft = {
      razonSocial,
      nit: nitValidado,
      industria: v['INDUSTRIA'] ?? '',
      direccion: v['DIRECCION'] ?? '',
      ciudad: v['CIUDAD'] ?? '',
      estado: estadoDesde(v['ESTADO'] ?? ''),
    }

    try {
      await createEmpresa(draft)
      exitosos += 1
    } catch (e) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear la empresa'}`)
    }
    onProgreso?.(idx + 1, filas.length)
  }

  return { registros: filas.length, exitosos, errores: detalleErrores.length, detalleErrores, avisos: [] }
}
