// Persistencia de plantillas y grupos de correo SOLO en el navegador (localStorage).
// Cuando exista el backend, este archivo es lo único que cambia (mismas firmas).
import type { GrupoCorreos, Plantilla, PlantillaDraft, ResultadoEnvioPlantilla } from '../types/plantilla'
import { PLANTILLAS_MOCK, PLANTILLAS_STORAGE_KEY, GRUPOS_STORAGE_KEY } from '../constants/campanas.constants'

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
  if (guardadas && Array.isArray(guardadas)) return guardadas
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

// ── Envío (SOLO simulado por ahora, sin backend) ────────────────────
export async function enviarPlantilla(args: {
  plantilla: string
  asunto: string
  destinatarios: string[]
}): Promise<ResultadoEnvioPlantilla> {
  // Simula latencia de red; cuando exista el backend aquí va el fetch real.
  await new Promise(r => setTimeout(r, 600))
  return { ...args, fecha: new Date().toISOString() }
}
