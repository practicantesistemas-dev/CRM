<script setup lang="ts">
import { useAuth, tienePermiso } from '@/features/auth/composables/useAuth'
import SeccionColapsable from '@/shared/components/SeccionColapsable.vue'
import AsignarRolUsuario from '../components/AsignarRolUsuario.vue'
import UsuariosDelCrm from '../components/UsuariosDelCrm.vue'

const { me } = useAuth()
const puedeAsignarRoles = tienePermiso('configuracion:gestionar')
</script>

<template>
  <div class="space-y-6">
    <SeccionColapsable titulo="Mi cuenta">
      <div class="surface-card rounded-2xl p-5 space-y-3 text-[13px] text-body">
        <div><span class="text-muted font-semibold">Nombre:</span> {{ me?.nombres }}</div>
        <div><span class="text-muted font-semibold">Usuario:</span> {{ me?.username }}</div>
        <div><span class="text-muted font-semibold">Correo:</span> {{ me?.email }}</div>
        <div><span class="text-muted font-semibold">Rol:</span> {{ me?.portal_role }}</div>
        <div><span class="text-muted font-semibold">Rol en el CRM:</span> {{ me?.role_crm }}</div>
        <div><span class="text-muted font-semibold">Área:</span> {{ me?.area_name }}</div>
      </div>
    </SeccionColapsable>

    <template v-if="puedeAsignarRoles">
      <SeccionColapsable
        titulo="Buscar nuevo usuario para asignar rol"
        subtitulo="Busca por nombre y elige uno de los roles disponibles (Admin y Jefe se administran aparte)."
      >
        <AsignarRolUsuario />
      </SeccionColapsable>

      <SeccionColapsable
        titulo="Usuarios del CRM"
        subtitulo="Usuarios que ya tienen un rol asignado."
        :abierto-por-defecto="false"
      >
        <UsuariosDelCrm />
      </SeccionColapsable>
    </template>
  </div>
</template>
