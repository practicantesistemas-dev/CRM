<script setup lang="ts">
import type { ServicioTop } from '../types/dashboard'

defineProps<{ servicios: ServicioTop[] }>()

const puestoColor = (idx: number) =>
  idx === 0 ? '#C9A227' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : '#CBD5E1'
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-[12px] font-bold text-[#0F172A]">Top Servicios</h3>
      <span class="text-[10px] text-slate-400">Por solicitudes</span>
    </div>
    <div class="space-y-3">
      <div v-for="(svc, idx) in servicios" :key="svc.nombre" class="flex items-center gap-3">
        <span
          class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
          :style="{ backgroundColor: puestoColor(idx) }"
        >{{ idx + 1 }}</span>
        <div class="flex-1 min-w-0">
          <p class="text-[11px] font-semibold text-slate-700 truncate">{{ svc.nombre }}</p>
          <p class="text-[10px] text-slate-400">{{ svc.solicitudes }} solicitudes</p>
        </div>
        <span class="text-[11px] font-bold text-emerald-600 flex-shrink-0">{{ svc.conversion }}</span>
      </div>
    </div>
  </div>
</template>
