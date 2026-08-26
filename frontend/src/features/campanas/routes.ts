import type { RouteRecordRaw } from 'vue-router'

// El módulo real (pages/List.vue) queda construido pero sin exponer: todavía no está listo
// para producción. Mientras tanto la ruta muestra un aviso de "próximamente".
const routes: RouteRecordRaw[] = [
  {
    path: 'campanas',
    name: 'campanas',
    component: () => import('@/shared/components/ModuloProximamente.vue'),
    props: { modulo: 'Campañas' },
  },
]

export default routes
