<script setup lang="ts">
import { ref } from 'vue'
import { buscarUsuarios, getRolesAsignables, asignarRol } from '../services/usuariosRoles.api'
import type { UsuarioBusqueda, RolAsignable } from '../types/usuarioRol'

const nombreBusqueda = ref('')
const resultados = ref<UsuarioBusqueda[]>([])
const rolesAsignables = ref<RolAsignable[]>([])
const rolSeleccionado = ref<Record<number, number | null>>({})
const buscando = ref(false)
const guardandoId = ref<number | null>(null)
const busquedaRealizada = ref(false)
const error = ref('')
const mensaje = ref('')

getRolesAsignables()
  .then((roles) => (rolesAsignables.value = roles))
  .catch(() => (error.value = 'No se pudieron cargar los roles disponibles.'))

const buscar = async () => {
  if (nombreBusqueda.value.trim().length < 2) {
    error.value = 'Escribe al menos 2 letras del nombre.'
    return
  }
  error.value = ''
  mensaje.value = ''
  buscando.value = true
  try {
    resultados.value = await buscarUsuarios(nombreBusqueda.value.trim())
    busquedaRealizada.value = true
    for (const u of resultados.value) rolSeleccionado.value[u.id] = u.roleCrmId
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo buscar usuarios.'
  } finally {
    buscando.value = false
  }
}

const guardar = async (usuario: UsuarioBusqueda) => {
  const rolId = rolSeleccionado.value[usuario.id]
  if (!rolId || rolId === usuario.roleCrmId) return
  error.value = ''
  mensaje.value = ''
  guardandoId.value = usuario.id
  try {
    await asignarRol(usuario.id, rolId)
    usuario.roleCrmId = rolId
    usuario.roleCrm = rolesAsignables.value.find((r) => r.id === rolId)?.nombre ?? null
    mensaje.value = `Rol actualizado para ${usuario.nombres}. Si tenía sesión abierta, se le cerrará en su próxima acción.`
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo asignar el rol.'
  } finally {
    guardandoId.value = null
  }
}
</script>

<template>
  <section class="space-y-3">
    <div>
      <h2 class="text-[16px] font-bold text-[#0F172A] dark:text-slate-100">Asignar rol de CRM a un usuario</h2>
      <p class="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">
        Busca por nombre y elige uno de los roles disponibles (Admin y Jefe se administran aparte).
      </p>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div class="flex gap-2">
        <input
          v-model="nombreBusqueda"
          @keyup.enter="buscar"
          type="text"
          placeholder="Buscar por nombre..."
          class="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[13px] outline-none focus:border-[#2447F9]"
        />
        <button
          @click="buscar"
          :disabled="buscando"
          class="px-4 py-2 rounded-lg bg-[#2447F9] text-white text-[12px] font-bold disabled:opacity-50 shrink-0"
        >
          {{ buscando ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>

      <p v-if="error" class="text-[12px] text-red-600 dark:text-red-400">{{ error }}</p>
      <p v-if="mensaje" class="text-[12px] text-emerald-600 dark:text-emerald-400">{{ mensaje }}</p>

      <div v-if="resultados.length" class="overflow-x-auto -mx-5">
        <table class="w-full text-[12px]">
          <thead>
            <tr class="text-left text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-700">
              <th class="font-semibold px-5 py-2">Nombre</th>
              <th class="font-semibold px-2 py-2">Usuario</th>
              <th class="font-semibold px-2 py-2">Rol actual</th>
              <th class="font-semibold px-2 py-2">Nuevo rol</th>
              <th class="px-5 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in resultados"
              :key="u.id"
              class="border-b border-slate-50 dark:border-slate-800 last:border-0"
            >
              <td class="px-5 py-2.5 font-semibold text-slate-800 dark:text-slate-200">{{ u.nombres }}</td>
              <td class="px-2 py-2.5 text-slate-500 dark:text-slate-400">{{ u.usuario }}</td>
              <td class="px-2 py-2.5 text-slate-500 dark:text-slate-400">{{ u.roleCrm ?? 'Sin asignar' }}</td>
              <td class="px-2 py-2.5">
                <select
                  v-model="rolSeleccionado[u.id]"
                  class="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px]"
                >
                  <option :value="null" disabled>Elegir rol...</option>
                  <option v-for="r in rolesAsignables" :key="r.id" :value="r.id">{{ r.nombre }}</option>
                </select>
              </td>
              <td class="px-5 py-2.5 text-right">
                <button
                  @click="guardar(u)"
                  :disabled="guardandoId === u.id || !rolSeleccionado[u.id] || rolSeleccionado[u.id] === u.roleCrmId"
                  class="px-3 py-1.5 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold disabled:opacity-50"
                >
                  {{ guardandoId === u.id ? 'Guardando...' : 'Guardar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else-if="busquedaRealizada && !buscando" class="text-[12px] text-slate-400 dark:text-slate-500">
        No se encontraron usuarios con ese nombre.
      </p>
    </div>
  </section>
</template>
