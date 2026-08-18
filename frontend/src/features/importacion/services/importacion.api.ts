import { authHeader } from '@/features/auth/composables/useAuth'
import type { RegistroImportacion, TipoImportacion } from '../types/importacion'

const API_URL = import.meta.env.VITE_CRM_API_URL

// Mismo patrón que contactos.api.ts/empresas.api.ts: el backend devuelve el motivo puntual
// del rechazo en { detail }; se usa ese mensaje en vez de uno genérico.
async function lanzarErrorConDetalle(response: Response, mensajeError: string): Promise<never> {
  const body = await response.json().catch(() => null)
  const detail = typeof body?.detail === 'string' ? body.detail : null
  throw new Error(detail ?? mensajeError)
}

interface ImportacionResponse {
  id: number
  tipo: string | null
  archivo: string | null
  registros: number | null
  errores: number | null
  detalle_errores: string[]
  avisos: string[]
  fecha: string | null
  usuario: string | null
}

// El detalle fila por fila (detalleErrores/avisos) se persiste en mercadeo_crm_importaciones
// (como JSON en texto), así que el reporte descargable sigue disponible aunque el historial se
// cargue en una sesión distinta a la que hizo la importación. Los registros creados antes de
// esa columna llegan con listas vacías.
function mapImportacion(r: ImportacionResponse): RegistroImportacion {
  const registros = r.registros ?? 0
  const errores = r.errores ?? 0
  return {
    id: r.id,
    archivo: r.archivo ?? '',
    tipo: (r.archivo ?? '').toLowerCase().endsWith('.csv') ? 'CSV' : 'Excel',
    tipoImportacion: (r.tipo as TipoImportacion) ?? 'contactos',
    fecha: r.fecha ? r.fecha.split('T')[0] : '',
    registros,
    exitosos: Math.max(registros - errores, 0),
    errores,
    estado: errores > 0 ? 'Con errores' : 'Completado',
    usuario: r.usuario ?? '—',
    detalleErrores: r.detalle_errores ?? [],
    avisos: r.avisos ?? [],
  }
}

export async function getHistorialRemoto(): Promise<RegistroImportacion[]> {
  const response = await fetch(`${API_URL}/api/importaciones/?limit=50`, { headers: authHeader() })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo cargar el historial de importaciones.')
  const data: ImportacionResponse[] = await response.json()
  return data.map(mapImportacion)
}

// Guarda el resultado de una importación en mercadeo_crm_importaciones; el backend resuelve
// el usuario_id a partir del Bearer token (mismo patrón que POST /api/contactos/).
export async function registrarImportacion(
  tipo: TipoImportacion, archivo: string, registros: number, errores: number,
  detalleErrores: string[], avisos: string[],
): Promise<RegistroImportacion> {
  const response = await fetch(`${API_URL}/api/importaciones/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ tipo, archivo, registros, errores, detalle_errores: detalleErrores, avisos }),
  })
  if (!response.ok) await lanzarErrorConDetalle(response, 'No se pudo guardar el registro de la importación.')
  const r: ImportacionResponse = await response.json()
  return mapImportacion(r)
}
