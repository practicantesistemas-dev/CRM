<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import type { Kpi } from '../types/dashboard'

defineProps<{ kpis: Kpi[] }>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
    <div
      v-for="kpi in kpis"
      :key="kpi.label"
      class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-default"
    >
      <div class="flex items-center justify-between mb-4">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ backgroundColor: kpi.bg }">
          <component :is="kpi.icono" :size="17" :style="{ color: kpi.color }" />
        </div>
        <span
          class="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
          :class="kpi.positivo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
        >
          <component :is="kpi.positivo ? TrendingUp : TrendingDown" :size="9" />
          {{ kpi.delta }}
        </span>
      </div>
      <div class="text-[24px] font-bold text-[#0F172A] leading-none mb-1">{{ kpi.valor }}</div>
      <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{{ kpi.label }}</div>
      <div class="text-[10px] text-slate-400 mt-0.5">{{ kpi.subtexto }}</div>
    </div>
  </div>
</template>
