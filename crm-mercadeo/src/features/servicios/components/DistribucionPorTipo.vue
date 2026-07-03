<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import type { Servicio } from '../types/servicio'
import { TIPOS_SERVICIO, tipoBarColor } from '../constants/servicios.constants'

const props = defineProps<{ servicios: Servicio[]; totalSolicitudes: number }>()

const solicitudesPorTipo = (tipo: string) =>
  props.servicios.filter(s => s.tipo === tipo).reduce((acc, s) => acc + s.solicitudes, 0)
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center gap-2 mb-4">
      <Tag :size="14" class="text-[#C9A227]" />
      <h3 class="text-[13px] font-bold text-[#0F172A]">Distribución por tipo</h3>
    </div>
    <div class="space-y-3">
      <div v-for="tipo in TIPOS_SERVICIO" :key="tipo">
        <div class="flex justify-between text-[11px] mb-1.5">
          <span class="font-medium text-slate-600">{{ tipo }}</span>
          <span class="font-bold text-[#0F172A]">{{ solicitudesPorTipo(tipo) }} sol.</span>
        </div>
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all"
            :style="{
              width: (solicitudesPorTipo(tipo) / totalSolicitudes * 100) + '%',
              backgroundColor: tipoBarColor(tipo)
            }" />
        </div>
      </div>
    </div>
  </div>
</template>
