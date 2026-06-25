<script setup lang="ts">
import { ref } from 'vue'

type Menu =
  | 'contacts'
  | 'campaigns'
  | 'automations'
  | 'prospectos'

const emit = defineEmits<{
  (e: 'navigate', menu: Menu): void
  (e: 'cargaMasiva'): void
}>()

const activo = ref<Menu>('contacts')

const menus = [
  {
    id: 'contacts',
    nombre: 'Contacts',
    icono: 'pi pi-user'
  },
  {
    id: 'campaigns',
    nombre: 'Campaigns',
    icono: 'pi pi-megaphone'
  },
  {
    id: 'automations',
    nombre: 'Automatizations',
    icono: 'pi pi-sync'
  },
  {
    id: 'prospectos',
    nombre: 'Prospectos',
    icono: 'pi pi-users'
  }
]

function seleccionar(menu: Menu) {
  activo.value = menu
  emit('navigate', menu)
}
</script>

<template>
  <aside class="w-full h-full bg-white flex flex-col justify-between">

    <!-- Encabezado + Menú -->
    <div>

      <div class="px-6 pt-6">
        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          BANDEJA DE INTELIGENCIA
        </p>

        <h2 class="text-2xl font-light text-slate-600 mt-1">
          CRM Enterprise
        </h2>
      </div>

      <nav class="mt-10 px-3 space-y-2">

        <button
          v-for="item in menus"
          :key="item.id"
          @click="seleccionar(item.id)"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200"
          :class="[
            activo === item.id
              ? 'bg-blue-700 text-white'
              : 'text-slate-700 hover:bg-slate-100'
          ]"
        >
          <i :class="[item.icono,'text-lg']"></i>

          <span class="text-sm font-medium">
            {{ item.nombre }}
          </span>

        </button>

      </nav>

    </div>

    <!-- Parte inferior -->
    <div class="px-3 pb-5">

      <button
        @click="$emit('cargaMasiva')"
        class="w-full h-12 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-semibold transition"
      >
        Carga Masiva
      </button>

      <div class="border-t border-slate-200 mt-5 pt-5 space-y-3">

        <button
          class="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="pi pi-question-circle"></i>

          <span class="text-sm">
            Help
          </span>

        </button>

        <button
          class="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
        >
          <i class="pi pi-cog"></i>

          <span class="text-sm">
            Settings
          </span>

        </button>

      </div>

    </div>

  </aside>
</template>

<style scoped>
aside{
    min-height:100%;
}
</style>