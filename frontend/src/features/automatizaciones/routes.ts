import type { RouteRecordRaw } from 'vue-router'

// El módulo genérico de automatizaciones (pages/List.vue) sigue siendo mock y no se
// expone. Lo único real por ahora es el envío de recordatorios de vencimiento del
// Plan Liga, que es lo que muestra la ruta.
const routes: RouteRecordRaw[] = [
  {
    path: 'automatizaciones',
    name: 'automatizaciones',
    component: () => import('./pages/RecordatoriosVencimiento.vue'),
  },
]

export default routes
