<script setup lang="ts">
import type { ActividadReciente } from '../types/dashboard'

defineProps<{ actividades: ActividadReciente[] }>()
</script>

<template>
  <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
      <div>
        <h3 class="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Actividad Reciente</h3>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Últimas interacciones registradas</p>
      </div>
    </div>
    <div class="divide-y divide-slate-50 dark:divide-slate-700">
      <div
        v-for="(act, i) in actividades"
        :key="i"
        class="flex items-start gap-3 px-5 py-3 hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors"
      >
        <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" :style="{ backgroundColor: act.bg }">
          <component :is="act.icono" :size="14" :style="{ color: act.color }" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100 truncate">
            {{ act.contacto }}
            <span class="font-normal text-slate-400 dark:text-slate-500"> · {{ act.empresa }}</span>
          </p>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 truncate">{{ act.tipo }} · {{ act.usuario }}</p>
          <p v-if="act.descripcion" class="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{{ act.descripcion }}</p>
        </div>
        <span class="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 whitespace-nowrap mt-0.5">{{ act.fechaHora }}</span>
      </div>
    </div>
  </div>
</template>
