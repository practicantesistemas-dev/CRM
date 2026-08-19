<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { AccesoRapido } from '../types/dashboard'

defineProps<{ accesos: AccesoRapido[] }>()

const router = useRouter()

// Campañas y Automatizaciones aún no están implementadas (mismo motivo que se ocultan del
// menú lateral en MainLayout.vue): la tarjeta se sigue mostrando igual que las demás, solo que
// al hacer clic no navega a ningún lado.
const RUTAS_SIN_IMPLEMENTAR = new Set(['campanas', 'automatizaciones'])
const irA = (ruta: string) => {
  if (RUTAS_SIN_IMPLEMENTAR.has(ruta)) return
  router.push('/' + ruta)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
    <h3 class="text-[13px] font-bold text-[#0F172A] dark:text-slate-100 mb-4">Accesos Rápidos</h3>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="item in accesos"
        :key="item.label"
        @click="irA(item.ruta)"
        class="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
          :style="{ backgroundColor: item.bg }"
        >
          <component :is="item.icono" :size="16" :style="{ color: item.color }" />
        </div>
        <span class="text-[10px] font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
