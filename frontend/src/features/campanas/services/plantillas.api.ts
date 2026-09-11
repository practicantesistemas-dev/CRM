// Grupos de correo: SOLO en el navegador (localStorage) por ahora.
// Plantillas: crear/actualizar SÍ van al backend real (POST/PUT /api/plantillas,
// tabla mercadeo_crm_plantillas_correo) — listar/duplicar/eliminar todavía no
// tienen endpoint, asi que siguen espejadas en localStorage para que el listado
// del CRM sigua funcionando. El ENVÍO va al backend real (POST /api/correos/campana/enviar).
import type { GrupoCorreos, Plantilla, PlantillaDraft, ResultadoEnvioPlantilla } from '../types/plantilla'
import {
  PLANTILLAS_MOCK, PLANTILLAS_STORAGE_KEY, PLANTILLAS_PROMOVIDAS_STORAGE_KEY, GRUPOS_STORAGE_KEY,
} from '../constants/campanas.constants'
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

function seedsPromovidos(): Set<string> {
  return new Set(leer<string[]>(PLANTILLAS_PROMOVIDAS_STORAGE_KEY, []))
}
function marcarSeedPromovido(seedId: string) {
  const promovidos = seedsPromovidos()
  promovidos.add(seedId)
  escribir(PLANTILLAS_PROMOVIDAS_STORAGE_KEY, [...promovidos])
}

// ── Plantillas ──────────────────────────────────────────────────────
export function getPlantillas(): Plantilla[] {
  // Las plantillas de ejemplo (id "seed-…") se re-siembran siempre desde el
  // código, así los ajustes de marca/textos llegan aunque el navegador ya
  // tuviera una copia vieja — EXCEPTO las que ya se "promovieron" a una fila
  // real (ver actualizarPlantilla): esas dejan de sembrarse para no
  // duplicarse junto a su copia ya guardada en el backend.
  const seedsVigentes = PLANTILLAS_MOCK.filter(p => !seedsPromovidos().has(p.id))

  const guardadas = leer<Plantilla[] | null>(PLANTILLAS_STORAGE_KEY, null)
  if (guardadas && Array.isArray(guardadas)) {
    // Las que creó el usuario (o ya se promovieron) se conservan intactas.
    const delUsuario = guardadas.filter(p => !p.id.startsWith('seed-'))
    const reconciliadas = [...seedsVigentes, ...delUsuario]
    escribir(PLANTILLAS_STORAGE_KEY, reconciliadas)
    return reconciliadas
  }
  // Primera vez: siembra las de ejemplo.
  escribir(PLANTILLAS_STORAGE_KEY, seedsVigentes)
  return [...seedsVigentes]
}

// Respuesta de POST/PUT /api/plantillas (schemas.PlantillaRead del backend).
interface RespuestaPlantillaApi {
  id: number
  nombre: string
  asunto: string | null
  html: string | null
  css: string | null
  proyecto: unknown
  fecha_creacion: string | null
  fecha_actualizacion: string | null
}

const aPlantilla = (data: PlantillaDraft, api: RespuestaPlantillaApi): Plantilla => ({
  nombre: data.nombre,
  asunto: data.asunto,
  html: data.html,
  css: data.css,
  proyecto: data.proyecto,
  id: String(api.id),
  creadoEn: api.fecha_creacion ?? ahora(),
  actualizadoEn: api.fecha_actualizacion ?? ahora(),
})

// El id de una plantilla creada en el backend es el ID (numerico) de
// mercadeo_crm_plantillas_correo; el de las de ejemplo ("seed-…") no existe
// ahi, asi que esas nunca se mandan a actualizar por PUT.
const esIdDeBackend = (id: string) => /^\d+$/.test(id)

export async function crearPlantilla(data: PlantillaDraft): Promise<Plantilla> {
  let nueva: Plantilla
  try {
    const res = await fetch(`${API_URL}/api/plantillas`, {
      method: 'POST',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    nueva = aPlantilla(data, await res.json())
  } catch (e) {
    // Sin backend disponible (o migracion/servidor caido): se guarda solo
    // localmente para no perder el trabajo del usuario, igual que antes.
    console.warn('[plantillas] no se pudo guardar en el backend, queda solo local:', e)
    nueva = { ...data, id: uid(), creadoEn: ahora(), actualizadoEn: ahora() }
  }
  escribir(PLANTILLAS_STORAGE_KEY, [nueva, ...getPlantillas()])
  return nueva
}

export async function actualizarPlantilla(id: string, data: PlantillaDraft): Promise<Plantilla | null> {
  const lista = getPlantillas()
  const idx = lista.findIndex(p => p.id === id)
  if (idx === -1) return null

  if (!esIdDeBackend(id)) {
    // Plantilla de ejemplo ("seed-…") o creada antes de tener backend: no
    // hay fila real que ajustar con PUT. Se "promueve": se crea de verdad en
    // la BD con estos cambios (POST) y el id local pasa del "seed-…" al
    // numerico real que asigna el backend, para que el siguiente guardado ya
    // sí sea un PUT sobre esa misma fila.
    const promovida = await crearPlantilla(data)
    if (id.startsWith('seed-')) marcarSeedPromovido(id)
    escribir(
      PLANTILLAS_STORAGE_KEY,
      [promovida, ...getPlantillas().filter(p => p.id !== id)],
    )
    return promovida
  }

  let actualizada: Plantilla
  try {
    const res = await fetch(`${API_URL}/api/plantillas/${id}`, {
      method: 'PUT',
      headers: { ...authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    actualizada = aPlantilla(data, await res.json())
  } catch (e) {
    console.warn('[plantillas] no se pudo guardar el ajuste en el backend, queda solo local:', e)
    actualizada = { ...lista[idx], ...data, id, actualizadoEn: ahora() }
  }

  lista[idx] = actualizada
  escribir(PLANTILLAS_STORAGE_KEY, lista)
  return actualizada
}

export function duplicarPlantilla(id: string): Promise<Plantilla | null> {
  const original = getPlantillas().find(p => p.id === id)
  if (!original) return Promise.resolve(null)
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
