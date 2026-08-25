<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { getUsuariosConRol, getRolesAsignables } from '../services/usuariosRoles.api'
import type { UsuarioBusqueda, RolAsignable } from '../types/usuarioRol'
import TablaUsuariosRol from './TablaUsuariosRol.vue'

const usuarios = ref<UsuarioBusqueda[]>([])
const rolesAsignables = ref<RolAsignable[]>([])
const cargando = ref(true)
const error = ref('')

getRolesAsignables()
  .then((roles) => (rolesAsignables.value = roles))
  .catch(() => (error.value = 'No se pudieron cargar los roles disponibles.'))

getUsuariosConRol()
  .then((data) => (usuarios.value = data))
  .catch((e) => (error.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de usuarios.'))
  .finally(() => (cargando.value = false))
</script>

<template>
  <div class="surface-card rounded-2xl p-5 space-y-4">
    <p v-if="cargando" class="flex items-center gap-1.5 text-[12px] text-muted">
      <Loader2 :size="13" class="animate-spin" />Cargando...
    </p>
    <p v-else-if="error" class="text-[12px] text-red-600 dark:text-red-400">{{ error }}</p>
    <template v-else>
      <TablaUsuariosRol :usuarios="usuarios" :roles="rolesAsignables" />
      <p v-if="!usuarios.length" class="text-[12px] text-muted">
        Todavía no hay usuarios con rol asignado en el CRM.
      </p>
    </template>
  </div>
</template>
