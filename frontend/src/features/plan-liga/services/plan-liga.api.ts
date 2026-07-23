import type {
  Beneficiario, BeneficiarioDraft, Titular, TitularDraft,
  ResumenTitularesResponse, TitularListadoResponse, ListadoTitularesResponse,
  BeneficiarioListadoResponse, TitularDetalleResponse, PlanTitular, PlanServicio,
} from '../types/plan-liga'
import { joinNombreCompleto, splitNombreCompleto } from '@/shared/utils/nombreCompuesto'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function obtenerJson<T>(ruta: string, mensajeError: string): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`)
  if (!response.ok) await lanzarErrorConDetalle(response, mensajeError)
  return response.json()
}

// El backend devuelve el motivo puntual del rechazo en { detail }
// (ej. "el titular {id} está inactivo"); se usa ese mensaje en vez de uno genérico.
async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

// Quita comas, puntos, guiones, numerales y demás caracteres raros de la dirección
// antes de mandarla al backend (deja solo letras, números y espacios).
function limpiarDireccion(direccion: string): string {
  return direccion
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const ESTADO_TITULAR_API: Record<Titular['estado'], string> = { Activo: 'A', Inactivo: 'I' }
const SEXO_TITULAR_API: Record<Titular['sexo'], string | null> = { Masculino: 'M', Femenino: 'F', '': null }

/** Selector de titulares (usado por Oportunidades/Actividades): trae el listado real del backend. */
export async function getTitulares(): Promise<Titular[]> {
  const { items } = await getListadoTitulares({ limit: 2000 })
  return items
}

export async function createTitular(data: TitularDraft): Promise<void> {
  const { nombre1, nombre2, apellido1, apellido2 } = splitNombreCompleto(data.nombre)
  const body = {
    TIPO_PLAN: data.tipoPlan,
    TIPO_DOCUMENTO: data.tipoDocumento,
    DOCUMENTO: data.documento,
    NOMBRE1: nombre1,
    NOMBRE2: nombre2,
    APELLIDO1: apellido1,
    APELLIDO2: apellido2,
    FECHA_NACIMIENTO: data.fechaNacimiento,
    SEXO: SEXO_TITULAR_API[data.sexo],
    DIRECCION: limpiarDireccion(data.direccion),
    CIUDAD: data.ciudad,
    DEPARTAMENTO: data.departamento,
    CORREO: data.correo,
    TELEFONO: data.telefono,
    FECHA_INGRESO: data.fechaInscripcion,
    TIPO_AFILIADO: data.tipoAfiliado,
    EMPRESA: data.empresa,
    EPS: data.eps,
    OTRAEPS: data.otraEps,
    PLAN_SALUD: data.planSalud,
    PLAN_NOMBRE: data.planNombre,
    SERVICIO_ID: data.servicioId ?? 0,
  }
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el titular.')
}

export async function updateTitular(id: number, data: TitularDraft): Promise<Titular> {
  const { nombre1, nombre2, apellido1, apellido2 } = splitNombreCompleto(data.nombre)
  const body = {
    DOCUMENTO: data.documento,
    TIPO_DOCUMENTO: data.tipoDocumento,
    NOMBRE1: nombre1,
    NOMBRE2: nombre2,
    APELLIDO1: apellido1,
    APELLIDO2: apellido2,
    FECHA_NACIMIENTO: data.fechaNacimiento,
    SEXO: SEXO_TITULAR_API[data.sexo],
    CORREO: data.correo,
    TELEFONO: data.telefono,
    DIRECCION: limpiarDireccion(data.direccion),
    CIUDAD: data.ciudad,
    DEPARTAMENTO: data.departamento,
    EMPRESA: data.empresa,
    ESTADO: ESTADO_TITULAR_API[data.estado],
  }
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar el titular.')
  return { ...data, id }
}

export async function activarTitular(idTitular: number, fechaIngreso: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/activar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ FECHA_INGRESO: fechaIngreso }),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo activar el titular.')
}

export async function desactivarTitular(idTitular: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/desactivar`, {
    method: 'POST',
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo desactivar el titular.')
}

const ESTADO_BENEFICIARIO_API: Record<Beneficiario['estado'], string> = {
  Activo: 'A', Inactivo: 'I', Reemplazado: 'R', Retirado: 'X',
}
const SEXO_BENEFICIARIO_API: Record<Beneficiario['sexo'], string | null> = { Masculino: 'M', Femenino: 'F', '': null }

export async function createBeneficiario(idTitular: number, data: BeneficiarioDraft): Promise<void> {
  const { nombre1, nombre2, apellido1, apellido2 } = splitNombreCompleto(data.nombre)
  const body = {
    TIPO_DOCUMENTO: data.tipoDocumento,
    DOCUMENTO: data.documento,
    NOMBRE1: nombre1,
    NOMBRE2: nombre2,
    APELLIDO1: apellido1,
    APELLIDO2: apellido2,
    FECHA_NACIMIENTO: data.fechaNacimiento,
    SEXO: SEXO_BENEFICIARIO_API[data.sexo],
    DIRECCION: limpiarDireccion(data.direccion),
    CIUDAD: data.ciudad,
    DEPARTAMENTO: data.departamento,
    CORREO: data.correo,
    TELEFONO: data.telefono,
    EMPRESA: data.empresa,
    EPS: data.eps,
    OTRAEPS: data.otraEps,
    PLAN_SALUD: data.planSalud,
    PLAN_NOMBRE: data.planNombre,
    FECHA_INGRESO: data.fechaInscripcion,
  }
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/beneficiarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo crear el beneficiario.')
}

export async function updateBeneficiario(idTitular: number, idBeneficiario: number, data: BeneficiarioDraft): Promise<Beneficiario> {
  const { nombre1, nombre2, apellido1, apellido2 } = splitNombreCompleto(data.nombre)
  const body = {
    TIPO_DOCUMENTO: data.tipoDocumento,
    DOCUMENTO: data.documento,
    NOMBRE1: nombre1,
    NOMBRE2: nombre2,
    APELLIDO1: apellido1,
    APELLIDO2: apellido2,
    FECHA_NACIMIENTO: data.fechaNacimiento,
    SEXO: SEXO_BENEFICIARIO_API[data.sexo],
    DIRECCION: limpiarDireccion(data.direccion),
    CIUDAD: data.ciudad,
    DEPARTAMENTO: data.departamento,
    CORREO: data.correo,
    TELEFONO: data.telefono,
    EMPRESA: data.empresa,
    TIPO_PLAN: data.tipoPlan,
    EPS: data.eps,
    OTRAEPS: data.otraEps,
    PLAN_SALUD: data.planSalud,
    PLAN_NOMBRE: data.planNombre,
    ESTADO: ESTADO_BENEFICIARIO_API[data.estado],
  }
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/beneficiarios/${idBeneficiario}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo actualizar el beneficiario.')
  return { ...data, id: idBeneficiario, titularId: idTitular }
}

export async function getResumenTitulares(): Promise<ResumenTitularesResponse> {
  return obtenerJson<ResumenTitularesResponse>(
    '/api/titulares-beneficiarios/resumen',
    'No se pudo cargar el resumen de titulares.',
  )
}

const ESTADO_API: Record<'Activo' | 'Inactivo', string> = { Activo: 'activo', Inactivo: 'inactivo' }
const SEXO_API: Record<'Masculino' | 'Femenino', string> = { Masculino: 'M', Femenino: 'F' }

export interface ListadoTitularesParams {
  limit?: number
  offset?: number
  estado?: 'Activo' | 'Inactivo'
  plan?: string
  sexo?: 'Masculino' | 'Femenino'
  edad?: '0-17' | '18-35' | '36-50' | '51+'
  busqueda?: string
}

export interface ListadoTitulares {
  items: Titular[]
  total: number
  limit: number
  offset: number
}

// El backend puede traer BENEFICIARIOS (conteo real) sin PLANES (nombre) cuando el
// titular no tiene un plan vinculado correctamente; no se descartan esos conteos solo
// porque falte el nombre del plan.
function parsePlanesDetalle(planesStr: string | null, beneficiariosStr: string | null): PlanTitular[] {
  const nombres = (planesStr ?? '').split('|').map(s => s.trim()).filter(Boolean)
  const cupos = (beneficiariosStr ?? '').split('|').map(s => s.trim()).filter(Boolean)
  const cantidad = Math.max(nombres.length, cupos.length)
  return Array.from({ length: cantidad }, (_, i) => {
    const [activos, cupo] = (cupos[i] ?? '0/0').split('/').map(n => Number(n) || 0)
    return { nombre: nombres[i] ?? '', activos, cupo }
  })
}

function mapTitularListado(r: TitularListadoResponse): Titular {
  const planesDetalle = parsePlanesDetalle(r.PLANES, r.BENEFICIARIOS)
  return {
    id: r.ID_TITULAR,
    tipoDocumento: r.TIPO_DOCUMENTO ?? '',
    documento: r.DOCUMENTO,
    nombre: r.TITULAR,
    fechaNacimiento: '',
    sexo: '',
    correo: r.EMAIL ?? '',
    telefono: r.TELEFONO ?? '',
    direccion: '',
    ciudad: '',
    departamento: '',
    empresa: r.EMPRESA ?? '',
    planContratado: planesDetalle.map(p => p.nombre).join(' | '),
    servicioId: null,
    tipoPlan: '',
    tipoAfiliado: '',
    eps: '',
    otraEps: '',
    planSalud: '',
    planNombre: '',
    fechaInscripcion: r.INSCRIPCION,
    estado: r.ESTADO === 'A' ? 'Activo' : 'Inactivo',
    planesDetalle,
  }
}

const SEXO_DESDE_API: Record<string, 'Masculino' | 'Femenino' | undefined> = { M: 'Masculino', F: 'Femenino' }

function mapTitularDetalle(r: TitularDetalleResponse): Titular {
  return {
    id: r.ID_TITULAR,
    tipoDocumento: r.TIPO_DOCUMENTO ?? '',
    documento: r.DOCUMENTO,
    nombre: joinNombreCompleto({
      nombre1: r.NOMBRE1 ?? '',
      nombre2: r.NOMBRE2 ?? '',
      apellido1: r.APELLIDO1 ?? '',
      apellido2: r.APELLIDO2 ?? '',
    }),
    fechaNacimiento: r.FECHA_NACIMIENTO ?? '',
    sexo: (r.SEXO && SEXO_DESDE_API[r.SEXO]) || '',
    correo: r.CORREO ?? '',
    telefono: r.TELEFONO ?? '',
    direccion: r.DIRECCION ?? '',
    ciudad: r.CIUDAD ?? '',
    departamento: r.DEPARTAMENTO ?? '',
    empresa: r.EMPRESA ?? '',
    planContratado: '',
    servicioId: null,
    tipoPlan: r.TIPO_PLAN ?? '',
    tipoAfiliado: r.TIPO_AFILIADO ?? '',
    eps: r.EPS ?? '',
    otraEps: r.OTRAEPS ?? '',
    planSalud: r.PLAN_SALUD ?? '',
    planNombre: r.PLAN_NOMBRE ?? '',
    fechaInscripcion: r.FECHA_INGRESO ?? '',
    estado: r.ESTADO === 'A' ? 'Activo' : 'Inactivo',
  }
}

function mapBeneficiarioListado(r: BeneficiarioListadoResponse, titularId: number): Beneficiario {
  return {
    id: r.ID,
    titularId,
    tipoDocumento: r.TIPO_DOCUMENTO ?? '',
    documento: r.DOCUMENTO,
    nombre: joinNombreCompleto({
      nombre1: r.NOMBRE1 ?? '',
      nombre2: r.NOMBRE2 ?? '',
      apellido1: r.APELLIDO1 ?? '',
      apellido2: r.APELLIDO2 ?? '',
    }),
    fechaNacimiento: r.FECHA_NACIMIENTO ?? '',
    sexo: (r.SEXO && SEXO_DESDE_API[r.SEXO]) || '',
    correo: r.CORREO ?? '',
    telefono: r.TELEFONO ?? '',
    direccion: r.DIRECCION ?? '',
    ciudad: r.CIUDAD ?? '',
    departamento: r.DEPARTAMENTO ?? '',
    empresa: r.EMPRESA ?? '',
    tipoPlan: r.TIPO_PLAN ?? '',
    eps: r.EPS ?? '',
    otraEps: r.OTRAEPS ?? '',
    planSalud: r.PLAN_SALUD ?? '',
    planNombre: r.PLAN_NOMBRE ?? '',
    estado: r.ESTADO === 'A' ? 'Activo' : 'Inactivo',
    fechaInscripcion: r.FECHA_INGRESO ?? '',
  }
}

export async function getBeneficiariosTitular(idTitular: number): Promise<Beneficiario[]> {
  const data = await obtenerJson<BeneficiarioListadoResponse[]>(
    `/api/titulares-beneficiarios/${idTitular}/beneficiarios`,
    'No se pudo cargar los beneficiarios del titular.',
  )
  return data.map(r => mapBeneficiarioListado(r, idTitular))
}

export async function activarBeneficiario(idTitular: number, idBeneficiario: number, fechaIngreso: string): Promise<Beneficiario> {
  const body = { FECHA_INGRESO: fechaIngreso }
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/beneficiarios/${idBeneficiario}/activar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo activar el beneficiario.')
  const data: { beneficiario: BeneficiarioListadoResponse } = await response.json()
  return mapBeneficiarioListado(data.beneficiario, idTitular)
}

export async function desactivarBeneficiario(idTitular: number, idBeneficiario: number): Promise<Beneficiario> {
  const response = await fetch(`${API_URL}/api/titulares-beneficiarios/${idTitular}/beneficiarios/${idBeneficiario}/desactivar`, {
    method: 'POST',
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo desactivar el beneficiario.')
  const data: { beneficiario: BeneficiarioListadoResponse } = await response.json()
  return mapBeneficiarioListado(data.beneficiario, idTitular)
}

export async function getTitular(idTitular: number): Promise<Titular> {
  const data = await obtenerJson<TitularDetalleResponse>(
    `/api/titulares-beneficiarios/${idTitular}`,
    'No se pudo cargar el detalle del titular.',
  )
  return mapTitularDetalle(data)
}

export async function getListadoTitulares(params: ListadoTitularesParams = {}): Promise<ListadoTitulares> {
  const query = new URLSearchParams()
  if (params.limit) query.set('limit', String(params.limit))
  if (params.offset) query.set('offset', String(params.offset))
  if (params.estado) query.set('estado', ESTADO_API[params.estado])
  if (params.plan) query.set('plan', params.plan)
  if (params.sexo) query.set('sexo', SEXO_API[params.sexo])
  if (params.edad) query.set('edad', params.edad)
  if (params.busqueda) query.set('busqueda', params.busqueda)
  const qs = query.toString()

  const data = await obtenerJson<ListadoTitularesResponse>(
    `/api/titulares-beneficiarios/listado${qs ? `?${qs}` : ''}`,
    'No se pudo cargar el listado de titulares.',
  )
  return {
    items: data.items.map(mapTitularListado),
    total: data.total,
    limit: data.limit,
    offset: data.offset,
  }
}

interface PlanNombreResponse {
  ID: number
  NOMBRE: string
}

async function fetchPlanesNombres(): Promise<PlanNombreResponse[]> {
  return obtenerJson<PlanNombreResponse[]>(
    '/api/titulares-beneficiarios/planes/nombres',
    'No se pudo cargar la lista de planes.',
  )
}

// El endpoint no devuelve strings planos: cada elemento es un objeto { ID, NOMBRE }.
export async function getNombresPlanes(): Promise<string[]> {
  const data = await fetchPlanesNombres()
  return data.map(p => p.NOMBRE)
}

// Mismo endpoint que getNombresPlanes, pero conservando el ID: se usa para asociar
// el titular a su plan/servicio (SERVICIO_ID) al crearlo.
export async function getPlanesServicio(): Promise<PlanServicio[]> {
  const data = await fetchPlanesNombres()
  return data.map(p => ({ id: p.ID, nombre: p.NOMBRE }))
}
