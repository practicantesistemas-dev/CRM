import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'contactos', name: 'contactos', component: () => import('./pages/List.vue') },
]

export default routes
