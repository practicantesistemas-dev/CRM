import type {
  Beneficiario, BeneficiarioDraft, Titular, TitularDraft,
  ResumenTitularesResponse, TitularListadoResponse, TitularDetalleResponse, PlanTitular,
} from '../types/plan-liga'
import { joinNombreCompleto } from '@/shared/utils/nombreCompuesto'
import { BENEFICIARIOS_MOCK, TITULARES_MOCK } from '../constants/plan-liga.constants'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function obtenerJson<T>(ruta: string, mensajeError: string): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`)
  if (!response.ok) throw new Error(mensajeError)
  return response.json()
}

let titulares: Titular[] = [...TITULARES_MOCK]
let beneficiarios: Beneficiario[] = [...BENEFICIARIOS_MOCK]

export function getTitulares(): Titular[] {
  return titulares
}

export function createTitular(data: TitularDraft): Titular {
  const nuevo: Titular = { ...data, id: Date.now() }
  titulares = [nuevo, ...titulares]
  return nuevo
}

export function updateTitular(id: number, data: Partial<TitularDraft>): Titular | null {
  const idx = titulares.findIndex(t => t.id === id)
  if (idx === -1) return null
  const actualizado: Titular = { ...titulares[idx], ...data, id }
  titulares = [...titulares.slice(0, idx), actualizado, ...titulares.slice(idx + 1)]
  return actualizado
}

export function getBeneficiarios(): Beneficiario[] {
  return beneficiarios
}

export function createBeneficiario(titularId: number, data: BeneficiarioDraft): Beneficiario {
  const nuevo: Beneficiario = { ...data, id: Date.now(), titularId }
  beneficiarios = [...beneficiarios, nuevo]
  return nuevo
}

export function updateBeneficiario(id: number, data: Partial<BeneficiarioDraft>): Beneficiario | null {
  const idx = beneficiarios.findIndex(b => b.id === id)
  if (idx === -1) return null
  const actualizado: Beneficiario = { ...beneficiarios[idx], ...data, id }
  beneficiarios = [...beneficiarios.slice(0, idx), actualizado, ...beneficiarios.slice(idx + 1)]
  return actualizado
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
  estado?: 'Activo' | 'Inactivo'
  plan?: string
  sexo?: 'Masculino' | 'Femenino'
  edad?: '0-17' | '18-35' | '36-50' | '51+'
}

function parsePlanesDetalle(planesStr: string, beneficiariosStr: string): PlanTitular[] {
  const nombres = planesStr.split('|').map(s => s.trim()).filter(Boolean)
  const cupos = beneficiariosStr.split('|').map(s => s.trim())
  return nombres.map((nombre, i) => {
    const [activos, cupo] = (cupos[i] ?? '0/0').split('/').map(n => Number(n) || 0)
    return { nombre, activos, cupo }
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
    sexo: 'Otro',
    correo: r.EMAIL,
    telefono: r.TELEFONO,
    direccion: '',
    ciudad: '',
    departamento: '',
    empresa: r.EMPRESA,
    planContratado: planesDetalle.map(p => p.nombre).join(' | '),
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

const SEXO_DESDE_API: Record<string, 'Masculino' | 'Femenino'> = { M: 'Masculino', F: 'Femenino' }

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
    sexo: (r.SEXO && SEXO_DESDE_API[r.SEXO]) || 'Otro',
    correo: r.CORREO ?? '',
    telefono: r.TELEFONO ?? '',
    direccion: r.DIRECCION ?? '',
    ciudad: r.CIUDAD ?? '',
    departamento: r.DEPARTAMENTO ?? '',
    empresa: r.EMPRESA ?? '',
    planContratado: '',
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

export async function getTitular(idTitular: number): Promise<Titular> {
  const data = await obtenerJson<TitularDetalleResponse>(
    `/api/titulares-beneficiarios/${idTitular}`,
    'No se pudo cargar el detalle del titular.',
  )
  return mapTitularDetalle(data)
}

export async function getListadoTitulares(params: ListadoTitularesParams = {}): Promise<Titular[]> {
  const query = new URLSearchParams()
  if (params.limit) query.set('limit', String(params.limit))
  if (params.estado) query.set('estado', ESTADO_API[params.estado])
  if (params.plan) query.set('plan', params.plan)
  if (params.sexo) query.set('sexo', SEXO_API[params.sexo])
  if (params.edad) query.set('edad', params.edad)
  const qs = query.toString()

  const data = await obtenerJson<TitularListadoResponse[]>(
    `/api/titulares-beneficiarios/listado${qs ? `?${qs}` : ''}`,
    'No se pudo cargar el listado de titulares.',
  )
  return data.map(mapTitularListado)
}

export async function getNombresPlanes(): Promise<string[]> {
  return obtenerJson<string[]>(
    '/api/titulares-beneficiarios/planes/nombres',
    'No se pudo cargar la lista de planes.',
  )
}
