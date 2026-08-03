import type { Contacto, ContactoDraft, Etiqueta, EtiquetaDraft } from '../types/contacto'
import { splitNombreCompleto, joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import { authHeader, useAuth } from '@/features/auth/composables/useAuth'
import { useUbicaciones } from '@/shared/composables/useUbicaciones'
import type { Departamento, Municipio } from '@/shared/types/ubicaciones'

const API_URL = import.meta.env.VITE_CRM_API_URL

// El backend devuelve el motivo puntual del rechazo en { detail }; se usa ese mensaje en vez
// de uno genérico (mismo patrón que plan-liga.api.ts).
async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

// ─── Etiquetas (GET/POST /api/etiquetas/, sin auth) ──────────────────────────
interface EtiquetaResponse { id: number; nombre: string; color: string }

export async function getEtiquetas(): Promise<Etiqueta[]> {
  const response = await fetch(`${API_URL}/api/etiquetas/?skip=0&limit=100`)
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudieron cargar las etiquetas.')
  const data: EtiquetaResponse[] = await response.json()
  return data.map(e => ({ id: e.id, nombre: e.nombre, color: e.color }))
}

export async function createEtiqueta(data: EtiquetaDraft): Promise<Etiqueta> {
  const response = await fetch(`${API_URL}/api/etiquetas/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: data.nombre, color: data.color }),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear la etiqueta.')
  const e: EtiquetaResponse = await response.json()
  return { id: e.id, nombre: e.nombre, color: e.color }
}

// ─── Contactos ────────────────────────────────────────────────────────────
interface ContactoReadResponse {
  id: number
  tipo_contacto: 'Cliente' | 'Prospecto' | null
  tipo_documento: string | null
  documento: string | null
  nombre1: string
  nombre2: string | null
  apellido1: string | null
  apellido2: string | null
  sexo: string | null
  correo: string | null
  telefono: string | null
  cargo: string | null
  municipio: string | null
  departamento: string | null
  fecha_nacimiento: string | null
  estado: string | null
  empresa_id: number | null
  responsable_id: number | null
  fecha_creacion: string | null
  fecha_actualizacion: string | null
  etiquetas: EtiquetaResponse[]
  empresa: { id: number; razon_social: string; nit: string; ciudad: string } | null
  responsable: { id: number; nombres: string; usuario: string } | null
}

const TIPO_DOC_VALIDOS: readonly string[] = ['CC', 'CE', 'TI', 'NIT', 'PP']
const ESTADO_VALIDOS: readonly string[] = ['Activo', 'Inactivo', 'Prospecto', 'En proceso']

// El formulario solo ofrece Masculino/Femenino; al backend se manda como M/F
// (mismo código que ya usa Plan Liga para SEXO), no la palabra completa. Como los datos
// existentes no siempre siguen esa convención (hay filas con "Masculino"/"Femenino" ya
// literales), SEXO_DESDE_API acepta ambas formas al leer.
const SEXO_API: Record<string, string | null> = { Masculino: 'M', Femenino: 'F' }
const SEXO_DESDE_API: Record<string, Contacto['sexo']> = { M: 'Masculino', F: 'Femenino', Masculino: 'Masculino', Femenino: 'Femenino' }

// Valores a usar cuando el backend no trae el dato y tampoco hay un draft de referencia
// (ej. al listar, a diferencia de crear no hay nada que el usuario acabe de escribir).
const FALLBACK: { tipoDocumento: Contacto['tipoDocumento']; estado: Contacto['estado']; tipoContacto: Contacto['tipoContacto'] } = {
  tipoDocumento: 'CC', estado: 'Activo', tipoContacto: 'Prospecto',
}

// Traduce la respuesta cruda del backend (snake_case, ids/códigos) al modelo Contacto que
// usa la UI. Se comparte entre listar y crear porque ambos endpoints devuelven la misma forma.
// `fallback` cubre datos que el backend no expone todavía (empresa/responsable por nombre) o
// que puede omitir (tipo_documento, estado): al crear se usa lo que el usuario acaba de
// escribir en el formulario; al listar simplemente se usa un valor neutro.
function mapContactoResponse(
  r: ContactoReadResponse,
  catalogo: { departamentos: Departamento[]; municipios: Municipio[] },
  fallback: { tipoDocumento?: Contacto['tipoDocumento']; estado?: Contacto['estado']; tipoContacto?: Contacto['tipoContacto']; sexo?: Contacto['sexo']; empresa?: string; responsable?: string } = {},
): Contacto {
  // ciudad/departamento viajan como código DIVIPOLA (igual que en Plan Liga), pero hay
  // registros antiguos con el nombre ya escrito de una: si no matchea ningún código del
  // catálogo, se muestra tal cual vino en vez de perder el dato.
  const nombreDepartamento = catalogo.departamentos.find(d => d.codigo === r.departamento)?.nombre ?? r.departamento ?? ''
  const nombreMunicipio = catalogo.municipios.find(m => m.codigo === r.municipio && m.departamentoCodigo === r.departamento)?.nombre ?? r.municipio ?? ''

  return {
    id: r.id,
    nombre: joinNombreCompleto({
      nombre1: r.nombre1, nombre2: r.nombre2 ?? '', apellido1: r.apellido1 ?? '', apellido2: r.apellido2 ?? '',
    }),
    tipoDocumento: (TIPO_DOC_VALIDOS.includes(r.tipo_documento ?? '') ? r.tipo_documento : fallback.tipoDocumento ?? FALLBACK.tipoDocumento) as Contacto['tipoDocumento'],
    documento: r.documento ?? '',
    correo: r.correo ?? '',
    telefono: r.telefono ?? '',
    empresa: r.empresa?.razon_social ?? fallback.empresa ?? '',
    cargo: r.cargo ?? '',
    ciudad: nombreMunicipio,
    departamento: nombreDepartamento,
    estado: (ESTADO_VALIDOS.includes(r.estado ?? '') ? r.estado : fallback.estado ?? FALLBACK.estado) as Contacto['estado'],
    tipoContacto: r.tipo_contacto ?? fallback.tipoContacto ?? FALLBACK.tipoContacto,
    fechaNacimiento: r.fecha_nacimiento ?? '',
    sexo: (r.sexo && SEXO_DESDE_API[r.sexo]) || fallback.sexo || '',
    etiquetas: r.etiquetas.map(e => ({ id: e.id, nombre: e.nombre, color: e.color })),
    responsable: r.responsable?.nombres ?? fallback.responsable ?? '',
  }
}

// Trae el listado real (GET /api/contactos/, sin auth). No expone paginación en el backend
// (ni "total" ni cabecera de conteo), así que se pide un límite amplio de una sola vez y el
// filtrado/paginado de la tabla se sigue resolviendo en el cliente (buscar, filtroEstado, etc.
// en useContactos.ts) — el endpoint sí soporta filtros propios (q, estado, ciudad,
// responsable_id, sexo, tipo_contacto, edad_min, edad_max) que no están conectados aún.
export async function getContactos(limit = 500): Promise<Contacto[]> {
  const response = await fetch(`${API_URL}/api/contactos/?skip=0&limit=${limit}`)
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el listado de contactos.')
  const data: ContactoReadResponse[] = await response.json()
  const { departamentos, municipios } = useUbicaciones()
  return data.map(r => mapContactoResponse(r, { departamentos: departamentos.value, municipios: municipios.value }))
}

// Crea el contacto en el backend real (POST /api/contactos/, requiere Bearer token).
// empresa_id se manda null: el formulario solo tiene texto libre de empresa, sin un id real
// que resolver (no hay endpoint de búsqueda de empresas todavía).
// responsable_id no se manda: el responsable es quien crea el contacto, y el backend lo
// resuelve él mismo a partir del Bearer token (mismo patrón que POST /api/bitacora/).
export async function createContacto(data: ContactoDraft): Promise<Contacto> {
  const { nombre1, nombre2, apellido1, apellido2 } = splitNombreCompleto(data.nombre)
  const body = {
    tipo_contacto: data.tipoContacto,
    tipo_documento: data.tipoDocumento || null,
    documento: data.documento || null,
    nombre1,
    nombre2: nombre2 || null,
    apellido1: apellido1 || null,
    apellido2: apellido2 || null,
    sexo: SEXO_API[data.sexo] ?? null,
    correo: data.correo || null,
    telefono: data.telefono || null,
    cargo: data.cargo || null,
    municipio: data.ciudad || null,
    departamento: data.departamento || null,
    fecha_nacimiento: data.fechaNacimiento || null,
    estado: data.estado || null,
    empresa_id: null,
    etiqueta_ids: data.etiquetas.map(e => e.id),
  }
  const response = await fetch(`${API_URL}/api/contactos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el contacto.')
  const r: ContactoReadResponse = await response.json()

  const { departamentos, municipios } = useUbicaciones()
  return mapContactoResponse(r, { departamentos: departamentos.value, municipios: municipios.value }, {
    tipoDocumento: data.tipoDocumento,
    estado: data.estado,
    tipoContacto: data.tipoContacto,
    sexo: data.sexo,
    empresa: data.empresa,
    // Respaldo por si la respuesta no trajera "responsable" (no debería pasar): quien
    // crea el contacto queda como responsable, así que se usa el usuario autenticado.
    responsable: useAuth().me.value?.nombres ?? '',
  })
}
