import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import MainLayout from '@/app/layouts/MainLayout.vue'
import AuthLayout from '@/app/layouts/AuthLayout.vue'

import { useAuth } from '@/features/auth/composables/useAuth'
import authRoutes from '@/features/auth/routes'
import dashboardRoutes from '@/features/dashboard/routes'
import planLigaRoutes from '@/features/plan-liga/routes'
import contactosRoutes from '@/features/contactos/routes'
import empresasRoutes from '@/features/empresas/routes'
import proveedoresRoutes from '@/features/proveedores/routes'
import oportunidadesRoutes from '@/features/oportunidades/routes'
import embudosRoutes from '@/features/embudos/routes'
import serviciosRoutes from '@/features/servicios/routes'
import segmentacionRoutes from '@/features/segmentacion/routes'
import campanasRoutes from '@/features/campanas/routes'
import relacionamientoRoutes from '@/features/relacionamiento/routes'
import importacionRoutes from '@/features/importacion/routes'
import automatizacionesRoutes from '@/features/automatizaciones/routes'
import usuariosRoutes from '@/features/usuarios/routes'
import configuracionRoutes from '@/features/configuracion/routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: AuthLayout,
    children: authRoutes,
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      ...dashboardRoutes,
      ...planLigaRoutes,
      ...contactosRoutes,
      ...empresasRoutes,
      ...proveedoresRoutes,
      ...oportunidadesRoutes,
      ...embudosRoutes,
      ...serviciosRoutes,
      ...segmentacionRoutes,
      ...campanasRoutes,
      ...relacionamientoRoutes,
      ...importacionRoutes,
      ...automatizacionesRoutes,
      ...usuariosRoutes,
      ...configuracionRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const { checkSession } = useAuth()
  const authenticated = checkSession()

  if (to.meta.requiresAuth && !authenticated) {
    return '/login'
  }

  if (to.path === '/login' && authenticated) {
    return '/'
  }
})

export default router
