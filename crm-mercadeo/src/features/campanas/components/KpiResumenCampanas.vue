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
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Send :size="15" class="text-[#2447F9]" /></div>
      <div class="text-[22px] font-bold text-[#0F172A]">{{ totalEnviados.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Total enviados</div>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#FCE7F3] flex items-center justify-center mb-3"><Eye :size="15" class="text-[#EC4899]" /></div>
      <div class="text-[22px] font-bold text-[#0F172A]">{{ totalAperturas.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Aperturas</div>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3"><MousePointer :size="15" class="text-[#059669]" /></div>
      <div class="text-[22px] font-bold text-[#0F172A]">{{ totalClics.toLocaleString('es-CO') }}</div>
      <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Clics</div>
    </div>
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div class="w-8 h-8 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><AlertCircle :size="15" class="text-[#C9A227]" /></div>
      <div class="text-[22px] font-bold text-[#0F172A]">{{ totalRebotes }}</div>
      <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">Rebotes</div>
    </div>
  </div>
</template>
