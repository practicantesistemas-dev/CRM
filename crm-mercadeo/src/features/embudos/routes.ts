import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'embudos', name: 'embudos', component: () => import('./pages/List.vue') },
]

export default routes
