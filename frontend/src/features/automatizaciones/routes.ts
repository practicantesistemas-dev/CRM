import type { RouteRecordRaw } from 'vue-router'

// El módulo real (pages/List.vue) queda construido pero sin exponer: todavía no está listo
// para producción. Mientras tanto la ruta muestra un aviso de "próximamente".
const routes: RouteRecordRaw[] = [
  {
    path: 'automatizaciones',
    name: 'automatizaciones',
    component: () => import('@/shared/components/ModuloProximamente.vue'),
    props: { modulo: 'Automatizaciones' },
  },
]

export default routes
