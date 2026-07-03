import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'campanas', name: 'campanas', component: () => import('./pages/List.vue') },
]

export default routes
