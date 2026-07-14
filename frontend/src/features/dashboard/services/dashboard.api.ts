import {
  ACCESOS_RAPIDOS_MOCK, KPI_META,
  TIPO_ACTIVIDAD_META, TIPO_ACTIVIDAD_DEFAULT, DISTRIBUCION_META, EMBUDO_COLORES,
} from '../constants/dashboard.constants'
import type {
  Kpi, TableroResumenResponse,
  ActividadReciente, ActividadRecienteResponse,
  DistribucionItem, DistribucionContactosResponse,
  ServicioTop, TopServicioResponse,
  EmbudoEtapa, EmbudoComercialItem,
} from '../types/dashboard'

const API_URL = import.meta.env.VITE_CRM_API_URL

async function obtenerJson<T>(ruta: string, mensajeError: string): Promise<T> {
  const response = await fetch(`${API_URL}${ruta}`)
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
    ...KPI_META[key],
    valor: String(data[key]?.valor ?? 0),
  }))
}

function normalizarTipo(tipo: string): string {
  return tipo.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function formatearHace(fechaIso: string | null): string {
  if (!fechaIso) return ''
  const diffMinutos = Math.round((Date.now() - new Date(fechaIso).getTime()) / 60000)
  if (diffMinutos < 1) return 'Hace un momento'
  if (diffMinutos < 60) return `Hace ${diffMinutos} min`
  const diffHoras = Math.round(diffMinutos / 60)
  if (diffHoras < 24) return `Hace ${diffHoras}h`
  return `Hace ${Math.round(diffHoras / 24)}d`
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
      contacto: a.contacto_nombre ?? 'Contacto sin nombre',
      empresa: a.empresa_nombre ?? 'Sin empresa',
      hace: formatearHace(a.fecha),
      usuario: a.usuario_nombre ?? 'Sistema',
      color: meta.color,
      bg: meta.bg,
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

export async function getTopServicios(limit: number): Promise<ServicioTop[]> {
  const data = await obtenerJson<TopServicioResponse[]>(
    `/api/tablero/top-servicios?limit=${limit}`,
    'No se pudo cargar el top de servicios.',
  )

  return data.map((s) => ({
    nombre: s.nombre,
    solicitudes: s.solicitudes,
    conversion: `${s.porcentaje}%`,
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