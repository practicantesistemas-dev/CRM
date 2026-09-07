import type { RouteRecordRaw } from 'vue-router'

// /embudos es el hub "Embudos y segmentación"; las demás son sus vistas.
const routes: RouteRecordRaw[] = [
  { path: 'embudos', name: 'embudos', component: () => import('./pages/EmbudosHub.vue') },
  { path: 'embudos/afiliado', name: 'embudos-afiliado', component: () => import('./pages/CicloVidaAfiliado.vue') },
  { path: 'segmentos', name: 'segmentos', component: () => import('./pages/SegmentosGuardados.vue') },
]

export default routes
