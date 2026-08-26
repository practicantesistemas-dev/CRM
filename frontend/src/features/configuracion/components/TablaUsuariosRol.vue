<script setup lang="ts">
import { ref, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { asignarRol, eliminarRol } from '../services/usuariosRoles.api'
import type { UsuarioBusqueda, RolAsignable } from '../types/usuarioRol'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

// Tabla reutilizable: la usan tanto la busqueda por nombre como el listado
// completo de "Usuarios del CRM" - ambas solo le pasan la lista de usuarios
// a mostrar, esta se encarga de elegir el rol y guardarlo.
const props = defineProps<{
  usuarios: UsuarioBusqueda[]
  roles: RolAsignable[]
}>()

const rolSeleccionado = ref<Record<number, number | null>>({})
const guardandoId = ref<number | null>(null)
const eliminandoId = ref<number | null>(null)
const confirmarEliminar = ref(false)
const usuarioAEliminar = ref<UsuarioBusqueda | null>(null)
const error = ref('')
const mensaje = ref('')

watch(
  () => props.usuarios,
  (usuarios) => {
    for (const u of usuarios) rolSeleccionado.value[u.id] = u.roleCrmId
  },
  { immediate: true },
)

const guardar = async (usuario: UsuarioBusqueda) => {
  const rolId = rolSeleccionado.value[usuario.id]
  if (!rolId || rolId === usuario.roleCrmId) return
  error.value = ''
  mensaje.value = ''
  guardandoId.value = usuario.id
  try {
    await asignarRol(usuario.id, rolId)
    usuario.roleCrmId = rolId
    usuario.roleCrm = props.roles.find((r) => r.id === rolId)?.nombre ?? null
    mensaje.value = `Rol actualizado para ${usuario.nombres}. Si tenía sesión abierta, se le cerrará en su próxima acción.`
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo asignar el rol.'
  } finally {
    guardandoId.value = null
  }
}

const pedirConfirmacionEliminar = (usuario: UsuarioBusqueda) => {
  usuarioAEliminar.value = usuario
  confirmarEliminar.value = true
}

const eliminar = async () => {
  const usuario = usuarioAEliminar.value
  if (!usuario) return
  error.value = ''
  mensaje.value = ''
  eliminandoId.value = usuario.id
  try {
    await eliminarRol(usuario.id)
    usuario.roleCrmId = null
    usuario.roleCrm = null
    rolSeleccionado.value[usuario.id] = null
    mensaje.value = `Se quitó el rol de ${usuario.nombres}. Si tenía sesión abierta, se le cerrará en su próxima acción.`
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo quitar el rol.'
  } finally {
    eliminandoId.value = null
    usuarioAEliminar.value = null
  }
}
</script>

<template>
  <div class="space-y-3">
    <p v-if="error" class="text-[12px] text-red-600 dark:text-red-400">{{ error }}</p>
    <p v-if="mensaje" class="text-[12px] text-emerald-600 dark:text-emerald-400">{{ mensaje }}</p>

    <div v-if="usuarios.length" class="surface-card rounded-2xl overflow-hidden -mx-5 sm:mx-0">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[560px] text-[12px]">
          <thead class="surface-header border-b border-default">
            <tr>
              <th class="text-left font-bold text-muted uppercase tracking-wider text-[10px] px-5 py-3">Nombre</th>
              <th class="text-left font-bold text-muted uppercase tracking-wider text-[10px] px-3 py-3">Usuario</th>
              <th class="text-left font-bold text-muted uppercase tracking-wider text-[10px] px-3 py-3">Rol actual</th>
              <th class="text-left font-bold text-muted uppercase tracking-wider text-[10px] px-3 py-3">Nuevo rol</th>
              <th class="text-right font-bold text-muted uppercase tracking-wider text-[10px] px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="u in usuarios" :key="u.id" class="surface-hover transition-colors">
              <td class="px-5 py-3 font-semibold text-heading">{{ u.nombres }}</td>
              <td class="px-3 py-3 text-body">{{ u.usuario }}</td>
              <td class="px-3 py-3 text-subtle">{{ u.roleCrm ?? 'Sin asignar' }}</td>
              <td class="px-3 py-3">
                <select
                  v-model="rolSeleccionado[u.id]"
                  class="input-surface px-2.5 py-1.5 rounded-lg text-[12px] outline-none focus:border-[#2447F9]"
                >
                  <option :value="null" disabled>Elegir rol...</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                </select>
              </td>
              <td class="px-5 py-3 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="guardar(u)"
                    :disabled="guardandoId === u.id || !rolSeleccionado[u.id] || rolSeleccionado[u.id] === u.roleCrmId"
                    class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#2447F9] hover:bg-[#1D3DD9] text-white text-[11px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Loader2 v-if="guardandoId === u.id" :size="12" class="animate-spin" />
                    {{ guardandoId === u.id ? 'Guardando...' : 'Guardar' }}
                  </button>
                  <button
                    @click="pedirConfirmacionEliminar(u)"
                    :disabled="!u.roleCrmId || eliminandoId === u.id"
                    class="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-gradient-to-b from-slate-300 to-slate-400 hover:from-slate-400 hover:to-slate-500 text-slate-800 dark:text-slate-900 text-[11px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Loader2 v-if="eliminandoId === u.id" :size="12" class="animate-spin" />
                    {{ eliminandoId === u.id ? 'Eliminando...' : 'Eliminar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmDialog
      v-model:visible="confirmarEliminar"
      titulo="Eliminar rol"
      :mensaje="`¿Eliminar el rol de CRM de ${usuarioAEliminar?.nombres}? Se queda sin rol en el sistema hasta que le asignes uno nuevo.`"
      texto-confirmar="Eliminar"
      @confirmar="eliminar"
    />
  </div>
</template>
