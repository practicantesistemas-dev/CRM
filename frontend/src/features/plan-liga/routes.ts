import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: 'plan-liga', name: 'plan-liga', component: () => import('./pages/List.vue') },
  {
    path: 'plan-liga-vencimientos',
    name: 'plan-liga-vencimientos',
    component: () => import('./pages/RecordatoriosVencimiento.vue'),
  },
]

export default routes
