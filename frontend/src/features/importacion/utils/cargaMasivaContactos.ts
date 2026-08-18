import type { ContactoDraft } from '@/features/contactos/types/contacto'
import type { Etiqueta } from '@/features/contactos/types/contacto'
import type { Empresa } from '@/features/empresas/types/empresa'
import type { Departamento, Municipio } from '@/shared/types/ubicaciones'
import { createContacto } from '@/features/contactos/services/contactos.api'
import { documentoIdentidad, nombrePersona, optionalEmail, telefonoCO, tipoDocumento } from '@/shared/utils/zodHelpers'
import { normalizarTexto, resolverUbicacion } from '@/shared/utils/resolverUbicacion'
import type { FilaPlantilla } from './leerHoja'
import { normalizarFechaImportacion } from './leerHoja'
import type { ResultadoImportacion } from '../types/importacion'

function sexoDesde(valor: string): ContactoDraft['sexo'] {
  const v = valor.trim().toUpperCase()
  if (v === 'M' || v === 'MASCULINO') return 'Masculino'
  if (v === 'F' || v === 'FEMENINO') return 'Femenino'
  return ''
}

function tipoContactoDesde(valor: string): ContactoDraft['tipoContacto'] {
  return normalizarTexto(valor) === 'cliente' ? 'Cliente' : 'Prospecto'
}

function empresaIdDesde(valor: string, empresas: Empresa[]): { id: number | null; advertencia?: string } {
  const texto = valor.trim()
  if (!texto) return { id: null }
  const match = empresas.find(e => normalizarTexto(e.razonSocial) === normalizarTexto(texto))
  if (match) return { id: match.id }
  return { id: null, advertencia: `EMPRESA "${texto}" no coincide con ninguna empresa existente; el contacto se creó sin empresa asociada` }
}

function etiquetasDesde(valor: string, etiquetas: Etiqueta[]): { seleccionadas: Etiqueta[]; advertencia?: string } {
  const nombres = valor.split(',').map(n => n.trim()).filter(Boolean)
  if (nombres.length === 0) return { seleccionadas: [] }
  const seleccionadas: Etiqueta[] = []
  const noEncontradas: string[] = []
  for (const nombre of nombres) {
    const match = etiquetas.find(e => normalizarTexto(e.nombre) === normalizarTexto(nombre))
    if (match) seleccionadas.push(match)
    else noEncontradas.push(nombre)
  }
  return {
    seleccionadas,
    advertencia: noEncontradas.length ? `Etiquetas no encontradas (se ignoraron): ${noEncontradas.join(', ')}` : undefined,
  }
}

// Mismas reglas de formato que usa el formulario manual de Contactos (contacto.schema.ts),
// para que un contacto cargado por Excel quede validado exactamente igual que uno digitado
// a mano. Un error acá bloquea SOLO esa fila (no se llama al backend); no confundir con los
// "avisos" (empresa/etiqueta sin coincidencia, o ciudad/departamento resueltos por similitud),
// que sí dejan crear el contacto.
// TIPO_DOCUMENTO: si viene vacío se deja vacío (no se inventa CC ni ningún otro valor); si
// viene pero no es uno de los códigos válidos, es un error de formato y la fila se rechaza.
// DEPARTAMENTO/CIUDAD: se resuelven contra el catálogo real (ver resolverUbicacion.ts) — si no
// coinciden ni exacta ni aproximadamente con ningún nombre del catálogo, también es un error
// de formato y la fila se rechaza (no se crea el contacto sin ciudad "por si acaso").
function validarFormatoContacto(
  v: Record<string, string>,
  catalogos: { departamentos: Departamento[]; municipios: Municipio[] },
): {
  errores: string[]
  nombre: string
  documento: string
  correo: string
  telefono: string
  tipoDocumento: ContactoDraft['tipoDocumento']
  departamento: string
  ciudad: string
  advertenciaUbicacion?: string
} {
  const errores: string[] = []

  const nombreCrudo = [v['PRIMER_NOMBRE'], v['SEGUNDO_NOMBRE'], v['PRIMER_APELLIDO'], v['SEGUNDO_APELLIDO']].filter(Boolean).join(' ')
  const resNombre = nombrePersona().safeParse(nombreCrudo)
  if (!resNombre.success) errores.push(`Nombre/apellido inválido: ${resNombre.error.issues[0].message}`)

  const resTipoDoc = tipoDocumento({ opcional: true }).safeParse(v['TIPO_DOCUMENTO'] ?? '')
  if (!resTipoDoc.success) errores.push(`TIPO_DOCUMENTO "${v['TIPO_DOCUMENTO']}" inválido: ${resTipoDoc.error.issues[0].message}`)

  const resDocumento = documentoIdentidad({ opcional: true }).safeParse(v['DOCUMENTO'] ?? '')
  if (!resDocumento.success) errores.push(`DOCUMENTO "${v['DOCUMENTO']}" inválido: ${resDocumento.error.issues[0].message}`)

  const resCorreo = optionalEmail().safeParse(v['CORREO'] ?? '')
  if (!resCorreo.success) errores.push(`CORREO "${v['CORREO']}" inválido: ${resCorreo.error.issues[0].message}`)

  const resTelefono = telefonoCO().safeParse(v['TELEFONO'] ?? '')
  if (!resTelefono.success) errores.push(`TELEFONO "${v['TELEFONO']}" inválido: ${resTelefono.error.issues[0].message}`)

  const ubicacion = resolverUbicacion(v['DEPARTAMENTO'] ?? '', v['CIUDAD'] ?? '', catalogos.departamentos, catalogos.municipios)
  errores.push(...ubicacion.errores)
  const notasAproximado: string[] = []
  if (ubicacion.departamentoAproximado) notasAproximado.push(`DEPARTAMENTO "${v['DEPARTAMENTO']}" se interpretó como el más parecido del catálogo`)
  if (ubicacion.municipioAproximado) notasAproximado.push(`CIUDAD "${v['CIUDAD']}" se interpretó como la más parecida del catálogo`)

  return {
    errores,
    nombre: resNombre.success ? resNombre.data : nombreCrudo,
    tipoDocumento: (resTipoDoc.success ? resTipoDoc.data : (v['TIPO_DOCUMENTO'] ?? '')) as ContactoDraft['tipoDocumento'],
    documento: resDocumento.success ? resDocumento.data : (v['DOCUMENTO'] ?? ''),
    correo: resCorreo.success ? resCorreo.data : (v['CORREO'] ?? ''),
    telefono: resTelefono.success ? resTelefono.data : (v['TELEFONO'] ?? ''),
    departamento: ubicacion.departamentoCodigo,
    ciudad: ubicacion.municipioCodigo,
    advertenciaUbicacion: notasAproximado.length ? notasAproximado.join('; ') : undefined,
  }
}

export interface CatalogosImportacionContactos {
  empresas: Empresa[]
  etiquetas: Etiqueta[]
  departamentos: Departamento[]
  municipios: Municipio[]
}

export async function procesarCargaMasivaContactos(
  filas: FilaPlantilla[],
  catalogos: CatalogosImportacionContactos,
  onProgreso?: (hechos: number, total: number) => void,
): Promise<ResultadoImportacion> {
  const detalleErrores: string[] = []
  const avisos: string[] = []
  let exitosos = 0

  for (const [idx, fila] of filas.entries()) {
    const v = fila.valores

    if (!(v['PRIMER_NOMBRE'] ?? '')) {
      detalleErrores.push(`Fila ${fila.filaExcel}: falta PRIMER_NOMBRE (obligatorio)`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const {
      errores: erroresFormato, nombre, tipoDocumento, documento, correo, telefono, departamento, ciudad, advertenciaUbicacion,
    } = validarFormatoContacto(v, catalogos)
    if (erroresFormato.length > 0) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${erroresFormato.join('; ')}`)
      onProgreso?.(idx + 1, filas.length)
      continue
    }

    const advertencias: string[] = []
    if (advertenciaUbicacion) advertencias.push(advertenciaUbicacion)

    const { id: empresaId, advertencia: advEmpresa } = empresaIdDesde(v['EMPRESA'] ?? '', catalogos.empresas)
    if (advEmpresa) advertencias.push(advEmpresa)

    const { seleccionadas: etiquetas, advertencia: advEtiquetas } = etiquetasDesde(v['ETIQUETAS'] ?? '', catalogos.etiquetas)
    if (advEtiquetas) advertencias.push(advEtiquetas)

    const { valor: fechaNacimiento, invalida: fechaInvalida } = normalizarFechaImportacion(v['FECHA_NACIMIENTO'] ?? '')
    if (fechaInvalida) advertencias.push(`FECHA_NACIMIENTO "${v['FECHA_NACIMIENTO']}" no tiene un formato válido (use DD/MM/AAAA); se dejó en blanco`)

    const draft: ContactoDraft = {
      nombre,
      tipoDocumento,
      documento,
      correo,
      telefono,
      empresaId,
      cargo: v['CARGO'] ?? '',
      ciudad,
      departamento,
      estado: 'Activo',
      tipoContacto: tipoContactoDesde(v['TIPO_CONTACTO'] ?? ''),
      fechaNacimiento,
      sexo: sexoDesde(v['SEXO'] ?? ''),
      etiquetas,
    }

    try {
      await createContacto(draft)
      exitosos += 1
      // Guion simple (no em dash): el em dash no es representable en el charset de la tabla de
      // historial de importaciones y llegaba corrupto al descargar el reporte en otra sesión.
      if (advertencias.length) avisos.push(`Fila ${fila.filaExcel}: creado con observaciones - ${advertencias.join('; ')}`)
    } catch (e) {
      detalleErrores.push(`Fila ${fila.filaExcel}: ${e instanceof Error ? e.message : 'no se pudo crear el contacto'}`)
    }
    onProgreso?.(idx + 1, filas.length)
  }

  return { registros: filas.length, exitosos, errores: detalleErrores.length, detalleErrores, avisos }
}
