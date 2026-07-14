<script setup lang="ts">
import type { ActividadReciente } from '../types/dashboard'

defineProps<{ actividades: ActividadReciente[]; error?: string | null }>()
</script>

<template>
  <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
      <div>
        <h3 class="text-[13px] font-bold text-[#0F172A]">Actividad Reciente</h3>
        <p class="text-[11px] text-slate-400 mt-0.5">Últimas interacciones registradas</p>
      </div>
    </div>
    <p v-if="error" class="text-[11px] text-red-500 px-5 py-3">{{ error }}</p>
    <div v-else class="divide-y divide-slate-50">
      <div
        v-for="act in actividades"
        :key="act.contacto + act.hace"
        class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
      >
        <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
          <component :is="act.icono" :size="14" :style="{ color: act.color }" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-semibold text-[#0F172A] truncate">
            {{ act.contacto }}
            <span class="font-normal text-slate-400"> · {{ act.empresa }}</span>
          </p>
          <p class="text-[11px] text-slate-400 truncate">{{ act.tipo }} · {{ act.usuario }}</p>
        </div>
        <span class="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">{{ act.hace }}</span>
      </div>
    </div>
  </div>
</template>
