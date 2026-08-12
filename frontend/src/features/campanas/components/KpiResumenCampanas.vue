<script setup lang="ts">
import { Send, Eye, MousePointer, AlertCircle } from 'lucide-vue-next'

defineProps<{
  totalEnviados: number
  totalAperturas: number
  totalClics: number
  totalRebotes: number
}>()
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <div class="surface-card rounded-2xl shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#EEF2FF] dark:bg-blue-950/50 flex items-center justify-center mb-3"><Send :size="15" class="text-[#2447F9] dark:text-blue-400" /></div>
      <div class="text-[22px] font-bold text-heading">{{ totalEnviados.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-subtle uppercase tracking-wide mt-0.5">Total enviados</div>
    </div>
    <div class="surface-card rounded-2xl shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#FCE7F3] dark:bg-pink-950/50 flex items-center justify-center mb-3"><Eye :size="15" class="text-[#EC4899] dark:text-pink-400" /></div>
      <div class="text-[22px] font-bold text-heading">{{ totalAperturas.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-subtle uppercase tracking-wide mt-0.5">Aperturas</div>
    </div>
    <div class="surface-card rounded-2xl shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#D1FAE5] dark:bg-emerald-950/50 flex items-center justify-center mb-3"><MousePointer :size="15" class="text-[#059669] dark:text-emerald-400" /></div>
      <div class="text-[22px] font-bold text-heading">{{ totalClics.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-subtle uppercase tracking-wide mt-0.5">Clics</div>
    </div>
    <div class="surface-card rounded-2xl shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#FEF9C3] dark:bg-amber-950/50 flex items-center justify-center mb-3"><AlertCircle :size="15" class="text-[#C9A227] dark:text-amber-400" /></div>
      <div class="text-[22px] font-bold text-heading">{{ totalRebotes }}</div>
      <div class="text-[10px] font-semibold text-subtle uppercase tracking-wide mt-0.5">Rebotes</div>
    </div>
  </div>
</template>
