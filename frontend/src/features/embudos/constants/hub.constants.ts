import { RefreshCw, Bookmark } from 'lucide-vue-next'

export interface HubCard {
  titulo: string
  descripcion: string
  ruta: string
  icono: unknown
  color: string
  bg: string
  dato: string
  datoLabel: string
}

// Datos numéricos = mock, solo para dar contexto del estado de cada vista.
export const HUB_CARDS: HubCard[] = [
  {
    titulo: 'Ciclo de vida afiliado',
    descripcion: 'Filtra un segmento de afiliados y actúa por correo o WhatsApp.',
    ruta: '/embudos/afiliado',
    icono: RefreshCw, color: '#EC4899', bg: '#FCE7F3',
    dato: '38', datoLabel: 'afiliados en riesgo',
  },
  {
    titulo: 'Segmentos guardados',
    descripcion: 'Grupos de contactos listos para correo, WhatsApp o crear tareas.',
    ruta: '/segmentos',
    icono: Bookmark, color: '#C9A227', bg: '#FEF9C3',
    dato: '6', datoLabel: 'segmentos activos',
  },
]
