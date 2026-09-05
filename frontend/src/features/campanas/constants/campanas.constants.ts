import type { Campana, CampanaDraft } from '../types/campana'
import type { Plantilla, PlantillaDraft } from '../types/plantilla'

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

// ── Plantillas HTML (editor visual) ───────────────────────────────────
// Persistencia solo en el navegador por ahora (localStorage), ver services/plantillas.api.ts.
export const PLANTILLAS_STORAGE_KEY = 'crm-campanas-plantillas'
export const GRUPOS_STORAGE_KEY = 'crm-campanas-grupos-correo'

export const PLANTILLA_DRAFT_VACIO: PlantillaDraft = {
  nombre: '', asunto: '', html: '', css: '', proyecto: null,
}

// HTML de arranque cuando se crea una plantilla nueva (tablas + estilos inline,
// como pide el correo). El editor la carga y el usuario la modifica visualmente.
export const PLANTILLA_HTML_INICIAL = `<table style="width:100%;background:#f4f2eb;padding:24px 0;font-family:Arial,Helvetica,sans-serif" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <table style="width:600px;max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden" cellpadding="0" cellspacing="0">
      <tr><td style="background:#2447F9;padding:20px 28px">
        <span style="color:#ffffff;font-size:18px;font-weight:bold">Liga Contra el Cáncer</span>
      </td></tr>
      <tr><td style="padding:32px 28px 8px 28px">
        <h1 style="font-size:22px;color:#0F172A;margin:0 0 12px 0">Hola {{nombre}}</h1>
        <p style="font-size:14px;line-height:1.6;color:#334155;margin:0 0 20px 0">
          Escribe aquí el contenido del correo. Puedes usar variables como
          {{empresa}} o {{ciudad}} y se reemplazan al enviar.
        </p>
      </td></tr>
      <tr><td align="center" style="padding:8px 28px 32px 28px">
        <a href="https://laligacontraelcancer.co" style="background:#EC4899;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;display:inline-block">
          Más información
        </a>
      </td></tr>
      <tr><td style="background:#f1e2df;padding:16px 28px;font-size:11px;color:#7a5a56">
        Liga Contra el Cáncer · Pereira, Colombia<br>
        Si no deseas recibir estos correos, escríbenos para darte de baja.
      </td></tr>
    </table>
  </td></tr>
</table>`

export const PLANTILLAS_MOCK: Plantilla[] = [
  {
    id: 'seed-bienvenida',
    nombre: 'Bienvenida — nuevo afiliado',
    asunto: '¡Bienvenido(a) a la Liga Contra el Cáncer!',
    html: PLANTILLA_HTML_INICIAL,
    css: '',
    proyecto: null,
    creadoEn: '2026-08-01',
    actualizadoEn: '2026-08-01',
  },
]

export const fmtFechaPlantilla = (iso: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Descarga el HTML como archivo .html en el navegador.
export const descargarHtml = (nombre: string, html: string) => {
  const slug = (nombre || 'plantilla').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slug || 'plantilla'}.html`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Pasa las reglas del CSS del editor a estilos INLINE en cada elemento del HTML,
// para que la plantilla quede en UN solo HTML autocontenido (que es además lo
// que mejor soportan los clientes de correo). Las @media (estilos de móvil) no
// se pueden hacer inline: se devuelven aparte para dejarlas en un <style>.
export const inlinearCss = (html: string, css: string): { html: string; restoCss: string } => {
  if (!css.trim()) return { html, restoCss: '' }
  let sheet: CSSStyleSheet
  try {
    sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
  } catch {
    return { html, restoCss: css }
  }
  const tpl = document.createElement('template')
  tpl.innerHTML = html
  const resto: string[] = []
  for (const rule of Array.from(sheet.cssRules)) {
    if (rule instanceof CSSStyleRule) {
      let els: NodeListOf<HTMLElement>
      try { els = tpl.content.querySelectorAll(rule.selectorText) } catch { continue }
      els.forEach((el) => {
        const prev = el.getAttribute('style')?.trim() ?? ''
        const sep = prev && !prev.endsWith(';') ? '; ' : prev ? ' ' : ''
        el.setAttribute('style', prev + sep + rule.style.cssText)
      })
    } else {
      resto.push(rule.cssText) // @media, @font-face, etc.
    }
  }
  return { html: tpl.innerHTML, restoCss: resto.join('\n') }
}

// Envuelve el HTML del editor en un documento de correo completo y autocontenido.
// Los estilos van inline en el HTML; solo las @media quedan en un <style>.
export const armarDocumentoCorreo = (html: string, css: string, asunto = 'Correo') => {
  const { html: htmlInline, restoCss } = inlinearCss(html, css)
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${asunto.replace(/</g, '&lt;')}</title>
${restoCss.trim() ? `<style>\n${restoCss}\n</style>` : ''}
</head>
<body style="margin:0;padding:0">
${htmlInline}
</body>
</html>`
}

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const esCorreoValido = (s: string) => RE_EMAIL.test(s.trim())
// Divide un texto libre ("a@x.com, b@y.com\nc@z.com;") en lista de correos.
export const parsearCorreos = (texto: string): string[] =>
  [...new Set(texto.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean))]

export const estadoStyle = (e: Campana['estado']) => {
  if (e === 'Enviada')    return 'text-emerald-600 dark:text-emerald-400'
  if (e === 'Programada') return 'text-[#1E3A8A] dark:text-blue-300'
  return 'text-slate-400 dark:text-slate-500'
}

export const tasaApertura = (c: Campana) => c.enviados > 0 ? Math.round(c.aperturas / c.enviados * 100) + '%' : '—'
export const tasaClic = (c: Campana) => c.enviados > 0 ? Math.round(c.clics / c.enviados * 100) + '%' : '—'
