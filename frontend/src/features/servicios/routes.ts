import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'servicios', name: 'servicios', component: () => import('./pages/List.vue') },
]

export default routes
