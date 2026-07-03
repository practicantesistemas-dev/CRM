import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'oportunidades', name: 'oportunidades', component: () => import('./pages/List.vue') },
]

export default routes
