import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'dashboard', name: 'dashboard', component: () => import('./pages/Dashboard.vue') },
]

export default routes
