import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'proveedores', name: 'proveedores', component: () => import('./pages/List.vue') },
]

export default routes
