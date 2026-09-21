import { RefreshCw, Bookmark } from 'lucide-vue-next'

export interface HubCard {
  titulo: string
  descripcion: string
  ruta: string
  icono: unknown
  color: string
  bg: string
  // dato/datoLabel: placeholder mientras EmbudosHub.vue carga el numero real
  // (ver datosReales alli) -- no son mock permanente, solo el estado inicial.
  dato: string
  datoLabel: string
}

export const HUB_CARDS: HubCard[] = [
  {
    titulo: 'Audiencias',
    descripcion: 'Arma una audiencia con filtros y actúa por correo o WhatsApp.',
    ruta: '/embudos/afiliado',
    icono: RefreshCw, color: '#EC4899', bg: '#FCE7F3',
    dato: '…', datoLabel: 'sin uso hace +90 días',
  },
  {
    titulo: 'Segmentos guardados',
    descripcion: 'Grupos de personas listos para correo, WhatsApp o crear tareas.',
    ruta: '/segmentos',
    icono: Bookmark, color: '#C9A227', bg: '#FEF9C3',
    dato: '…', datoLabel: 'segmentos activos',
  },
]
