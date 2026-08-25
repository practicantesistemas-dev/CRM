<script setup lang="ts">
import { ref } from 'vue'
import { Search, Loader2 } from 'lucide-vue-next'
import { buscarUsuarios, getRolesAsignables } from '../services/usuariosRoles.api'
import type { UsuarioBusqueda, RolAsignable } from '../types/usuarioRol'
import TablaUsuariosRol from './TablaUsuariosRol.vue'

const nombreBusqueda = ref('')
const resultados = ref<UsuarioBusqueda[]>([])
const rolesAsignables = ref<RolAsignable[]>([])
const buscando = ref(false)
const busquedaRealizada = ref(false)
const error = ref('')

getRolesAsignables()
  .then((roles) => (rolesAsignables.value = roles))
  .catch(() => (error.value = 'No se pudieron cargar los roles disponibles.'))

const buscar = async () => {
  if (nombreBusqueda.value.trim().length < 2) {
    error.value = 'Escribe al menos 2 letras del nombre.'
    return
  }
  error.value = ''
  buscando.value = true
  try {
    resultados.value = await buscarUsuarios(nombreBusqueda.value.trim())
    busquedaRealizada.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo buscar usuarios.'
  } finally {
    buscando.value = false
  }
}
</script>

<template>
  <div class="surface-card rounded-2xl p-5 space-y-4">
    <div class="flex gap-2">
      <div class="relative flex-1">
        <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          v-model="nombreBusqueda"
          @keyup.enter="buscar"
          type="text"
          placeholder="Buscar por nombre..."
          class="input-surface w-full pl-9 pr-3 h-9 rounded-lg text-[13px] outline-none focus:border-[#2447F9]"
        />
      </div>
      <button
        @click="buscar"
        :disabled="buscando"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] hover:bg-[#1D3DD9] text-white text-[12px] font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-all shrink-0"
      >
        <Loader2 v-if="buscando" :size="13" class="animate-spin" />
        Buscar
      </button>
    </div>

    <p v-if="error" class="text-[12px] text-red-600 dark:text-red-400">{{ error }}</p>

    <TablaUsuariosRol :usuarios="resultados" :roles="rolesAsignables" />

    <p v-if="busquedaRealizada && !buscando && !resultados.length" class="text-[12px] text-muted">
      No se encontraron usuarios con ese nombre.
    </p>
  </div>
</template>
