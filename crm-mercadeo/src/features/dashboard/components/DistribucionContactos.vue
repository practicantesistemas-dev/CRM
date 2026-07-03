<script setup lang="ts">
import { BarChart3 } from 'lucide-vue-next'
import type { DistribucionItem } from '../types/dashboard'

defineProps<{ distribucion: DistribucionItem[] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center gap-2 mb-4">
      <BarChart3 :size="14" class="text-[#2447F9]" />
      <h3 class="text-[12px] font-bold text-[#0F172A]">Distribución de Contactos</h3>
    </div>
    <div class="space-y-3">
      <div v-for="item in distribucion" :key="item.label">
        <div class="flex justify-between text-[11px] mb-1.5">
          <span class="font-medium text-slate-600">{{ item.label }}</span>
          <span class="font-bold text-[#0F172A]">{{ item.porcentaje }}%</span>
        </div>
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: item.porcentaje + '%', backgroundColor: item.color }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
