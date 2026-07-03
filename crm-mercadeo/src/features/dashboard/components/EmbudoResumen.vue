<script setup lang="ts">
import { GitBranch } from 'lucide-vue-next'
import type { EmbudoEtapa } from '../types/dashboard'

const props = defineProps<{ etapas: EmbudoEtapa[] }>()
const max = props.etapas[0]?.count ?? 1
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center gap-2 mb-5">
      <GitBranch :size="14" class="text-[#2447F9]" />
      <h3 class="text-[13px] font-bold text-[#0F172A]">Embudo Comercial</h3>
    </div>
    <div class="flex items-end gap-3 h-28">
      <div
        v-for="etapa in etapas"
        :key="etapa.etapa"
        class="flex-1 flex flex-col items-center gap-1.5"
      >
        <span class="text-[11px] font-bold text-[#0F172A]">{{ etapa.count }}</span>
        <div
          class="w-full rounded-t-lg transition-all"
          :style="{
            height: (etapa.count / max * 96) + 'px',
            backgroundColor: etapa.color,
            opacity: 0.85
          }"
        />
        <span class="text-[9px] text-slate-400 text-center leading-tight">{{ etapa.etapa }}</span>
      </div>
    </div>
  </div>
</template>
