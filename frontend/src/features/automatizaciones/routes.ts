import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'automatizaciones', name: 'automatizaciones', component: () => import('./pages/List.vue') },
]

export default routes
