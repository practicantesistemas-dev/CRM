import { authHeader } from '@/features/auth/composables/useAuth'
import {
  ACCESOS_RAPIDOS_MOCK, KPI_META,
  TIPO_ACTIVIDAD_META, TIPO_ACTIVIDAD_DEFAULT, DISTRIBUCION_META, EMBUDO_COLORES,
} from '../constants/dashboard.constants'
import type {
  Kpi, TableroResumenResponse,
  ActividadReciente, ActividadRecienteResponse,
  DistribucionItem, DistribucionContactosResponse,
  PlanTop, TopPlanResponse,
  EmbudoEtapa, EmbudoComercialItem,
} from '../types/dashboard'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function obtenerJson<T>(ruta: string, mensajeError: string): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`, { headers: authHeader() })
  if (!response.ok) {
    throw new Error(mensajeError)
  }
  return response.json()
}

export async function getKpis(periodo: string): Promise<Kpi[]> {
  const data = await obtenerJson<TableroResumenResponse>(
    `/api/tablero/resumen?periodo=${periodo}`,
    'No se pudo cargar el resumen del tablero.',
  )

  return (Object.keys(KPI_META) as (keyof TableroResumenResponse)[]).map((key) => ({
    ...KPI_META[key]!,
    valor: String(data[key]?.valor ?? 0),
  }))
}

function normalizarTipo(tipo: string): string {
  return tipo.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

// El backend entrega la fecha/hora del seguimiento ya en hora de Colombia (Bogotá/Pereira),
// sin sufijo de zona (ej. "2026-07-31T15:22:39"). Se formatean los componentes tal cual
// como llegan, en vez de pasarlos por `new Date(...)`, para que el navegador del usuario
// no la reinterprete según su propia zona horaria del sistema.
function formatearFechaHora(fechaIso: string | null): string {
  if (!fechaIso) return ''
  const m = fechaIso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!m) return fechaIso
  const [, anio, mes, dia, hora, min] = m
  return `${dia}/${mes}/${anio} ${hora}:${min}`
}

export async function getActividadReciente(limit: number): Promise<ActividadReciente[]> {
  const data = await obtenerJson<ActividadRecienteResponse[]>(
    `/api/tablero/actividad-reciente?limit=${limit}`,
    'No se pudo cargar la actividad reciente.',
  )

  return data.map((a) => {
    const meta = (a.tipo && TIPO_ACTIVIDAD_META[normalizarTipo(a.tipo)]) || TIPO_ACTIVIDAD_DEFAULT
    return {
      tipo: a.tipo ?? 'Actividad',
      icono: meta.icono,
      // Prioriza el titular de Plan Liga (si la actividad viene de ahí) sobre el contacto del CRM.
      contacto: a.titular_nombre ?? a.contacto_nombre ?? 'Contacto sin nombre',
      empresa: a.nombre_empresa ?? 'Sin empresa',
      fechaHora: formatearFechaHora(a.fecha),
      usuario: a.usuario_nombre ?? 'Sistema',
      color: meta.color,
      bg: meta.bg,
      descripcion: a.descripcion ?? '',
    }
  })
}

export async function getDistribucionContactos(periodo: string): Promise<DistribucionItem[]> {
  const data = await obtenerJson<DistribucionContactosResponse>(
    `/api/tablero/distribucion-contactos?periodo=${periodo}`,
    'No se pudo cargar la distribución de contactos.',
  )

  return (Object.keys(DISTRIBUCION_META) as (keyof typeof DISTRIBUCION_META)[]).map((key) => ({
    ...DISTRIBUCION_META[key],
    cantidad: data[key].cantidad,
    porcentaje: data[key].porcentaje,
  }))
}

export async function getTopPlanes(limit: number): Promise<PlanTop[]> {
  const data = await obtenerJson<TopPlanResponse[]>(
    `/api/tablero/top-planes?limit=${limit}`,
    'No se pudo cargar el top de planes.',
  )

  return data.map((p) => ({
    planId: p.plan_id,
    nombre: p.nombre,
    solicitudes: p.solicitudes,
    conversion: `${p.porcentaje}%`,
  }))
}

export async function getEmbudoComercial(periodo: string): Promise<EmbudoEtapa[]> {
  const data = await obtenerJson<EmbudoComercialItem[]>(
    `/api/tablero/embudo-comercial?periodo=${periodo}`,
    'No se pudo cargar el embudo comercial.',
  )

  return [...data]
    .sort((a, b) => a.orden - b.orden)
    .map((etapa, idx) => ({
      etapa: etapa.nombre,
      count: etapa.cantidad,
      color: EMBUDO_COLORES[idx % EMBUDO_COLORES.length],
    }))
}

export function getDashboardResumen() {
  return {
    accesosRapidos: ACCESOS_RAPIDOS_MOCK,
  }
}