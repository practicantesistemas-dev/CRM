import type { Contacto, ContactoDraft, Etiqueta, EtiquetaDraft } from '../types/contacto'
import { CONTACTOS_MOCK } from '../constants/contactos.constants'
import { splitNombreCompleto, joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import { authHeader } from '@/features/auth/composables/useAuth'

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
// No hay (todavía) un GET /api/contactos/ que traiga el listado real, así que la tabla
// sigue alimentada por este mock local; solo la creación pasa por el backend real.
let contactosMock: Contacto[] = [...CONTACTOS_MOCK]

export function getContactos(): Contacto[] {
  return contactosMock
}

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
}

const TIPO_DOC_VALIDOS: readonly string[] = ['CC', 'CE', 'TI', 'NIT', 'PP']
const ESTADO_VALIDOS: readonly string[] = ['Activo', 'Inactivo', 'Prospecto', 'En proceso']
const SEXO_VALIDOS: readonly string[] = ['Masculino', 'Femenino', 'Otro']

// Crea el contacto en el backend real (POST /api/contactos/, requiere Bearer token).
// empresa_id/responsable_id se mandan null: el formulario solo tiene texto libre de empresa
// y responsable, sin un id real que resolver (no hay endpoint de búsqueda de empresas/usuarios
// todavía); ese texto se conserva localmente para mostrarlo en la tabla, pero no se envía aquí.
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
    sexo: data.sexo || null,
    correo: data.correo || null,
    telefono: data.telefono || null,
    cargo: data.cargo || null,
    municipio: data.ciudad || null,
    departamento: data.departamento || null,
    fecha_nacimiento: data.fechaNacimiento || null,
    estado: data.estado || null,
    empresa_id: null,
    responsable_id: null,
    etiqueta_ids: data.etiquetas.map(e => e.id),
  }
  const response = await fetch(`${API_URL}/api/contactos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el contacto.')
  const r: ContactoReadResponse = await response.json()

  const nuevo: Contacto = {
    id: r.id,
    nombre: joinNombreCompleto({
      nombre1: r.nombre1, nombre2: r.nombre2 ?? '', apellido1: r.apellido1 ?? '', apellido2: r.apellido2 ?? '',
    }),
    tipoDocumento: (TIPO_DOC_VALIDOS.includes(r.tipo_documento ?? '') ? r.tipo_documento : data.tipoDocumento) as Contacto['tipoDocumento'],
    documento: r.documento ?? '',
    correo: r.correo ?? '',
    telefono: r.telefono ?? '',
    empresa: data.empresa,
    cargo: r.cargo ?? '',
    ciudad: r.municipio ?? '',
    departamento: r.departamento ?? '',
    estado: (ESTADO_VALIDOS.includes(r.estado ?? '') ? r.estado : data.estado) as Contacto['estado'],
    tipoContacto: r.tipo_contacto ?? data.tipoContacto,
    fechaNacimiento: r.fecha_nacimiento ?? '',
    sexo: (SEXO_VALIDOS.includes(r.sexo ?? '') ? r.sexo : data.sexo) as Contacto['sexo'],
    etiquetas: r.etiquetas.map(e => ({ id: e.id, nombre: e.nombre, color: e.color })),
    responsable: data.responsable,
  }
  contactosMock = [nuevo, ...contactosMock]
  return nuevo
}

export function updateContacto(id: number, data: ContactoDraft): Contacto | null {
  const idx = contactosMock.findIndex(c => c.id === id)
  if (idx === -1) return null
  const actualizado: Contacto = { ...data, id, etiquetas: [...data.etiquetas] }
  contactosMock = [...contactosMock.slice(0, idx), actualizado, ...contactosMock.slice(idx + 1)]
  return actualizado
}
