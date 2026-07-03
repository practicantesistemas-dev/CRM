import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'empresas', name: 'empresas', component: () => import('./pages/List.vue') },
]

export default routes
