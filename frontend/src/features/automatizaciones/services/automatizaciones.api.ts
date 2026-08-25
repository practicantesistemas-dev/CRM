import type { Automatizacion, AutomatizacionDraft } from '../types/automatizacion'
import { AUTOMATIZACIONES_MOCK, AVISO_CORREO_AUTOMATICO } from '../constants/automatizaciones.constants'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

let automatizaciones: Automatizacion[] = [...AUTOMATIZACIONES_MOCK]

// Dispara el webhook de n8n con los datos del correo que el usuario definió en la
// automatización (acción "Enviar correo"). El workflow en n8n es quien decide cómo enviarlo.
export async function enviarCorreosWebhook(automatizacion: Pick<Automatizacion, 'nombre' | 'correos' | 'asunto' | 'cuerpo'>) {
  if (!WEBHOOK_URL) throw new Error('No hay un webhook de n8n configurado (VITE_N8N_WEBHOOK_URL).')
  const correos = automatizacion.correos.split(',').map(c => c.trim()).filter(Boolean)
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      automatizacion: automatizacion.nombre,
      correos,
      asunto: automatizacion.asunto,
      cuerpo: `${automatizacion.cuerpo}\n\n${AVISO_CORREO_AUTOMATICO}`,
    }),
  })
  if (!response.ok) throw new Error(`El webhook de n8n respondió con error (${response.status}).`)
}

export function getAutomatizaciones(): Automatizacion[] {
  return automatizaciones
}

export function createAutomatizacion(data: AutomatizacionDraft): Automatizacion {
  const nueva: Automatizacion = {
    id: Date.now(),
    ...data,
    estado: 'Activa',
    ejecuciones: 0,
    ultimaEjecucion: null,
    creadoPor: 'Usuario actual',
    creadoEn: new Date().toISOString().split('T')[0],
    activo: true,
  }
  automatizaciones = [nueva, ...automatizaciones]
  return nueva
}

export function updateAutomatizacion(id: number, data: Partial<Automatizacion>): Automatizacion | null {
  const idx = automatizaciones.findIndex(a => a.id === id)
  if (idx === -1) return null
  const actualizada: Automatizacion = { ...automatizaciones[idx], ...data, id }
  automatizaciones = [...automatizaciones.slice(0, idx), actualizada, ...automatizaciones.slice(idx + 1)]
  return actualizada
}

export function deleteAutomatizacion(id: number) {
  automatizaciones = automatizaciones.filter(a => a.id !== id)
}
