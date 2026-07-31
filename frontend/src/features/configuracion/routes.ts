import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'configuracion', name: 'configuracion', component: () => import('./pages/perfil.vue') },
]

export default routes
