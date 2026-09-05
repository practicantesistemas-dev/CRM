import type { BlockProperties } from 'grapesjs'

// Bloques arrastrables del editor de correos. Todo con tablas + estilos inline
// (es lo que aguantan los clientes de correo). El usuario los arrastra al lienzo
// y luego edita textos, colores, enlaces, etc. desde el panel de la derecha.
const ico = (d: string) =>
  `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`

export const BLOQUES_CORREO: BlockProperties[] = [
  {
    id: 'encabezado',
    label: 'Encabezado',
    category: 'Estructura',
    media: ico('<rect x="3" y="4" width="18" height="6" rx="1"/><path d="M3 14h12M3 18h8"/>'),
    content: `<table style="width:100%;background:#2447F9" cellpadding="0" cellspacing="0"><tr>
      <td style="padding:20px 28px">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;font-family:Arial,Helvetica,sans-serif">Liga Contra el Cáncer</span>
      </td></tr></table>`,
  },
  {
    id: 'titulo',
    label: 'Título',
    category: 'Contenido',
    media: ico('<path d="M4 7h16M4 12h10M4 17h7"/>'),
    content: `<h1 style="font-size:22px;color:#0F172A;margin:0;padding:16px 28px 4px 28px;font-family:Arial,Helvetica,sans-serif">Escribe un título</h1>`,
  },
  {
    id: 'texto',
    label: 'Texto',
    category: 'Contenido',
    media: ico('<path d="M4 6h16M4 10h16M4 14h12M4 18h9"/>'),
    content: `<p style="font-size:14px;line-height:1.6;color:#334155;margin:0;padding:8px 28px;font-family:Arial,Helvetica,sans-serif">Escribe aquí el contenido del párrafo. Puedes usar variables como {{nombre}} o {{empresa}} y se reemplazan al enviar.</p>`,
  },
  {
    id: 'boton',
    label: 'Botón',
    category: 'Contenido',
    media: ico('<rect x="3" y="8" width="18" height="8" rx="2"/>'),
    content: `<table style="width:100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:16px 28px">
      <a href="https://laligacontraelcancer.co" style="background:#EC4899;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;display:inline-block;font-family:Arial,Helvetica,sans-serif">Más información</a>
    </td></tr></table>`,
  },
  {
    id: 'imagen',
    label: 'Imagen',
    category: 'Contenido',
    media: ico('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5L5 21"/>'),
    content: `<table style="width:100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:12px 28px">
      <img src="https://placehold.co/540x220/EEF2FF/2447F9?text=Imagen" alt="" style="max-width:100%;border-radius:6px;display:block" />
    </td></tr></table>`,
  },
  {
    id: 'dos-columnas',
    label: '2 columnas',
    category: 'Estructura',
    media: ico('<rect x="3" y="4" width="8" height="16" rx="1"/><rect x="13" y="4" width="8" height="16" rx="1"/>'),
    content: `<table style="width:100%" cellpadding="0" cellspacing="0"><tr>
      <td width="50%" style="padding:12px 14px 12px 28px;font-size:13px;line-height:1.6;color:#334155;vertical-align:top;font-family:Arial,Helvetica,sans-serif">Columna izquierda…</td>
      <td width="50%" style="padding:12px 28px 12px 14px;font-size:13px;line-height:1.6;color:#334155;vertical-align:top;font-family:Arial,Helvetica,sans-serif">Columna derecha…</td>
    </tr></table>`,
  },
  {
    id: 'divisor',
    label: 'Divisor',
    category: 'Estructura',
    media: ico('<path d="M4 12h16"/>'),
    content: `<table style="width:100%" cellpadding="0" cellspacing="0"><tr><td style="padding:8px 28px">
      <div style="border-top:1px solid #e2e8f0;font-size:1px;line-height:1px">&nbsp;</div>
    </td></tr></table>`,
  },
  {
    id: 'espaciador',
    label: 'Espacio',
    category: 'Estructura',
    media: ico('<path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4"/>'),
    content: `<table style="width:100%" cellpadding="0" cellspacing="0"><tr><td style="height:28px;font-size:1px;line-height:1px">&nbsp;</td></tr></table>`,
  },
  {
    id: 'pie',
    label: 'Pie de página',
    category: 'Estructura',
    media: ico('<rect x="3" y="14" width="18" height="6" rx="1"/><path d="M3 6h12M3 10h8"/>'),
    content: `<table style="width:100%;background:#f1e2df" cellpadding="0" cellspacing="0"><tr>
      <td style="padding:16px 28px;font-size:11px;line-height:1.6;color:#7a5a56;font-family:Arial,Helvetica,sans-serif">
        Liga Contra el Cáncer · Pereira, Colombia<br>
        Si no deseas recibir estos correos, escríbenos para darte de baja.
      </td></tr></table>`,
  },
]
