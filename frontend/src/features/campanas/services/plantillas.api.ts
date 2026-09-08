// Persistencia de plantillas y grupos de correo SOLO en el navegador (localStorage).
// El ENVÍO sí va al backend real (POST /api/correos/campana/enviar).
import type { GrupoCorreos, Plantilla, PlantillaDraft, ResultadoEnvioPlantilla } from '../types/plantilla'
import { PLANTILLAS_MOCK, PLANTILLAS_STORAGE_KEY, GRUPOS_STORAGE_KEY } from '../constants/campanas.constants'
import { authHeader } from '@/features/auth/composables/useAuth'

const API_URL = import.meta.env.VITE_CRM_API_URL

const uid = () => (crypto.randomUUID?.() ?? String(Date.now() + Math.random()))
const ahora = () => new Date().toISOString()

function leer<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function escribir(key: string, valor: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(valor))
  } catch {
    // localStorage lleno o bloqueado: en modo demo no es crítico.
  }
}

// ── Plantillas ──────────────────────────────────────────────────────
export function getPlantillas(): Plantilla[] {
  const guardadas = leer<Plantilla[] | null>(PLANTILLAS_STORAGE_KEY, null)
  if (guardadas && Array.isArray(guardadas)) {
    // Las plantillas de ejemplo (id "seed-…") se re-siembran siempre desde el
    // código, así los ajustes de marca/textos llegan aunque el navegador ya
    // tuviera una copia vieja. Las que creó el usuario se conservan intactas.
    const delUsuario = guardadas.filter(p => !p.id.startsWith('seed-'))
    const reconciliadas = [...PLANTILLAS_MOCK, ...delUsuario]
    escribir(PLANTILLAS_STORAGE_KEY, reconciliadas)
    return reconciliadas
  }
  // Primera vez: siembra las de ejemplo.
  escribir(PLANTILLAS_STORAGE_KEY, PLANTILLAS_MOCK)
  return [...PLANTILLAS_MOCK]
}

export function crearPlantilla(data: PlantillaDraft): Plantilla {
  const nueva: Plantilla = { ...data, id: uid(), creadoEn: ahora(), actualizadoEn: ahora() }
  escribir(PLANTILLAS_STORAGE_KEY, [nueva, ...getPlantillas()])
  return nueva
}

export function actualizarPlantilla(id: string, data: PlantillaDraft): Plantilla | null {
  const lista = getPlantillas()
  const idx = lista.findIndex(p => p.id === id)
  if (idx === -1) return null
  const actualizada: Plantilla = { ...lista[idx], ...data, id, actualizadoEn: ahora() }
  lista[idx] = actualizada
  escribir(PLANTILLAS_STORAGE_KEY, lista)
  return actualizada
}

export function duplicarPlantilla(id: string): Plantilla | null {
  const original = getPlantillas().find(p => p.id === id)
  if (!original) return null
  return crearPlantilla({
    nombre: `${original.nombre} (copia)`,
    asunto: original.asunto,
    html: original.html,
    css: original.css,
    proyecto: original.proyecto,
  })
}

export function eliminarPlantilla(id: string): void {
  escribir(PLANTILLAS_STORAGE_KEY, getPlantillas().filter(p => p.id !== id))
}

// ── Grupos de correo ────────────────────────────────────────────────
export function getGrupos(): GrupoCorreos[] {
  return leer<GrupoCorreos[]>(GRUPOS_STORAGE_KEY, [])
}

export function guardarGrupo(nombre: string, correos: string[]): GrupoCorreos {
  const grupos = getGrupos()
  const existente = grupos.find(g => g.nombre.toLowerCase() === nombre.trim().toLowerCase())
  if (existente) {
    existente.correos = correos
    escribir(GRUPOS_STORAGE_KEY, grupos)
    return existente
  }
  const nuevo: GrupoCorreos = { id: uid(), nombre: nombre.trim(), correos }
  escribir(GRUPOS_STORAGE_KEY, [...grupos, nuevo])
  return nuevo
}

export function eliminarGrupo(id: string): void {
  escribir(GRUPOS_STORAGE_KEY, getGrupos().filter(g => g.id !== id))
}

// ── Envío (backend real: Gmail vía POST /api/correos/campana/enviar) ─
interface RespuestaEnvioCampana {
  total: number
  enviados: number
  fallidos: number
  fallos: { correo: string; error: string }[]
}

export async function enviarPlantilla(args: {
  plantilla: string
  asunto: string
  html: string
  destinatarios: string[]
}): Promise<ResultadoEnvioPlantilla> {
  const res = await fetch(`${API_URL}/api/correos/campana/enviar`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      asunto: args.asunto,
      html: args.html,
      destinatarios: args.destinatarios,
    }),
  })

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null)
    const detalle = typeof cuerpo?.detail === 'string' ? cuerpo.detail : null
    throw new Error(detalle ?? `No se pudo enviar el correo (HTTP ${res.status}).`)
  }

  const data = (await res.json()) as RespuestaEnvioCampana
  const enviadosOk = args.destinatarios.filter(
    c => !data.fallos.some(f => f.correo === c),
  )

  if (data.enviados === 0) {
    const primero = data.fallos[0]?.error
    throw new Error(primero ? `No se pudo enviar: ${primero}` : 'No se pudo enviar a ningún destinatario.')
  }

  return {
    plantilla: args.plantilla,
    asunto: args.asunto,
    destinatarios: enviadosOk,
    enviados: data.enviados,
    fallidos: data.fallidos,
    fallos: data.fallos,
    fecha: new Date().toISOString(),
  }
}
