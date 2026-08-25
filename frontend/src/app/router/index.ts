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
    // Fuera de MainLayout a proposito: un usuario sin rol no debe ver el
    // menu/sidebar del CRM, solo este mensaje.
    path: '/sin-rol',
    name: 'sin-rol',
    component: () => import('@/features/auth/pages/SinRolAsignado.vue'),
    meta: { requiresAuth: true },
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
  const { checkSession, me } = useAuth()
  const authenticated = checkSession()

  if (to.meta.requiresAuth && !authenticated) {
    return '/login'
  }

  if (to.path === '/login' && authenticated) {
    return '/'
  }

  // Autenticado pero sin rol de CRM asignado: bloquea cualquier vista y
  // manda siempre a la pantalla informativa (excepto si ya está ahí, para
  // no quedar en bucle de redirects).
  if (authenticated && !me.value?.role_crm && to.path !== '/sin-rol') {
    return '/sin-rol'
  }

  // Ya tiene rol pero intenta entrar a /sin-rol a mano: no tiene sentido, lo
  // manda al dashboard.
  if (authenticated && !!me.value?.role_crm && to.path === '/sin-rol') {
    return '/dashboard'
  }
})

export default router
