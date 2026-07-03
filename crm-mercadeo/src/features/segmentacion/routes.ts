import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'segmentacion', name: 'segmentacion', component: () => import('./pages/List.vue') },
]

export default routes
