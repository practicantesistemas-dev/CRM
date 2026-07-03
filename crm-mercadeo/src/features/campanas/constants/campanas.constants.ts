import type { Campana, CampanaDraft } from '../types/campana'

export const CAMPANAS_MOCK: Campana[] = [
  { id: 1, nombre: 'Bienvenida Plan Liga Empresarial Q2', segmento: 'Empresas VIP Pereira', estado: 'Enviada', enviados: 312, aperturas: 187, clics: 94, rebotes: 8, fecha: '2026-06-10' },
  { id: 2, nombre: 'Recordatorio tamizajes julio', segmento: 'Prospectos sin gestión', estado: 'Enviada', enviados: 245, aperturas: 134, clics: 52, rebotes: 5, fecha: '2026-06-20' },
  { id: 3, nombre: 'Lanzamiento Brigadas Q3', segmento: 'Brigadas Medellín Q3', estado: 'Programada', enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '2026-07-05' },
  { id: 4, nombre: 'Capacitaciones agosto', segmento: 'Todos', estado: 'Borrador', enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '' },
]

export const CAMPANA_DRAFT_VACIO: CampanaDraft = {
  nombre: '', segmento: '', estado: 'Borrador', enviados: 0, aperturas: 0, clics: 0, rebotes: 0, fecha: '',
}

export const HTML_EDITOR_DEFAULT = `<h2 style="color:#2447F9;font-family:Inter,sans-serif">¡Hola {{nombre}}!</h2>
<p style="font-family:Inter,sans-serif;color:#334155">Te informamos sobre nuestros servicios del <strong>Plan Liga Ama Salvar Vidas</strong>.</p>
<p style="font-family:Inter,sans-serif;color:#334155">Tu empresa <strong>{{empresa}}</strong> puede beneficiarse de nuestros planes de bienestar y salud.</p>
<a href="#" style="display:inline-block;background:#2447F9;color:white;padding:10px 24px;border-radius:8px;text-decoration:none;font-family:Inter,sans-serif;font-weight:bold;margin-top:16px">Conocer más</a>`

export const VARIABLES_DINAMICAS = ['{{nombre}}', '{{empresa}}', '{{cargo}}', '{{ciudad}}', '{{servicio}}']

export const estadoStyle = (e: Campana['estado']) => {
  if (e === 'Enviada')    return 'text-emerald-600'
  if (e === 'Programada') return 'text-[#1E3A8A]'
  return 'text-slate-400'
}

export const tasaApertura = (c: Campana) => c.enviados > 0 ? Math.round(c.aperturas / c.enviados * 100) + '%' : '—'
export const tasaClic = (c: Campana) => c.enviados > 0 ? Math.round(c.clics / c.enviados * 100) + '%' : '—'
