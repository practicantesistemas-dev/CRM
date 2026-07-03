<script setup lang="ts">
import type { AccesoRapido } from '../types/dashboard'

defineProps<{ accesos: AccesoRapido[] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <h3 class="text-[13px] font-bold text-[#0F172A] mb-4">Accesos Rápidos</h3>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="item in accesos"
        :key="item.label"
        class="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div
          class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
          :style="{ backgroundColor: item.bg }"
        >
          <component :is="item.icono" :size="16" :style="{ color: item.color }" />
        </div>
        <span class="text-[10px] font-semibold text-slate-600 text-center leading-tight">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
