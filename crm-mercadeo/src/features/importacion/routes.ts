import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'importacion', name: 'importacion', component: () => import('./pages/List.vue') },
]

export default routes
