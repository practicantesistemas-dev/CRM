import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'plan-liga', name: 'plan-liga', component: () => import('./pages/List.vue') },
]

export default routes
