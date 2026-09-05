import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'campanas',
    name: 'campanas',
    component: () => import('@/features/campanas/pages/List.vue'),
  },
]

export default routes
