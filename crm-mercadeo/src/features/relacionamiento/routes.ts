import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'relacionamiento', name: 'relacionamiento', component: () => import('./pages/List.vue') },
]

export default routes
