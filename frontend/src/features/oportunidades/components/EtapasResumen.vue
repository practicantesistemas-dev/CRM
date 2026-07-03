<script setup lang="ts">
import type { EtapaOportunidad, Oportunidad } from '../types/oportunidad'

defineProps<{
  etapas: EtapaOportunidad[]
  oportunidades: Oportunidad[]
  filtroEstado: string
}>()
const emit = defineEmits<{ 'toggle-etapa': [etapa: EtapaOportunidad] }>()
</script>

<template>
  <div class="grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-7 gap-3">
    <div
      v-for="etapa in etapas"
      :key="etapa"
      class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 text-center cursor-pointer hover:border-[#2447F9] transition-all"
      :class="filtroEstado === etapa ? 'border-[#2447F9] bg-[#EEF2FF]' : ''"
      @click="emit('toggle-etapa', etapa)"
    >
      <div class="text-[20px] font-bold" :class="filtroEstado === etapa ? 'text-[#2447F9]' : 'text-[#0F172A]'">
        {{ oportunidades.filter(o => o.estado === etapa).length }}
      </div>
      <div class="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5 truncate">{{ etapa }}</div>
    </div>
  </div>
</template>
