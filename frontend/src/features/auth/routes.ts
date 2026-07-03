import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '', name: 'login', component: () => import('./pages/Login.vue') },
]

export default routes
