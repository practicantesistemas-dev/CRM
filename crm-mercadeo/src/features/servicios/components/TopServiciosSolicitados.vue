<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import type { Servicio } from '../types/servicio'

const props = defineProps<{ servicios: Servicio[] }>()
const max = props.servicios[0]?.solicitudes ?? 1

const puestoColor = (idx: number) =>
  idx === 0 ? '#C9A227' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : '#CBD5E1'
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center gap-2 mb-4">
      <BarChart3 :size="14" class="text-[#2447F9]" />
      <h3 class="text-[13px] font-bold text-[#0F172A]">Servicios más solicitados</h3>
    </div>
    <div class="space-y-4">
      <div v-for="(s, idx) in servicios" :key="s.id">
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
              :style="{ backgroundColor: puestoColor(idx) }">
              {{ idx + 1 }}
            </span>
            <span class="text-[12px] font-semibold text-slate-700">{{ s.nombre }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[11px] text-slate-400">{{ s.solicitudes }} sol.</span>
            <span class="text-[11px] font-bold text-emerald-600">{{ s.conversion }}</span>
          </div>
        </div>
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full bg-[#2447F9] transition-all" :style="{ width: (s.solicitudes / max * 100) + '%' }" />
        </div>
      </div>
    </div>
  </div>
</template>
