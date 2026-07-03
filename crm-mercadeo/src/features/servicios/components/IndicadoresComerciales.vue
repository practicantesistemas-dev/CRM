<script setup lang="ts">
import { Building2, Users, TrendingUp, BarChart3 } from 'lucide-vue-next'

defineProps<{
  totalEmpresas: number
  totalSolicitudes: number
  totalVentas: number
}>()
</script>

<template>
  <div>
    <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Indicadores Comerciales</h3>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#E8EAF6] flex items-center justify-center mb-3"><Building2 :size="17" class="text-[#1A2A6C]" /></div>
        <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalEmpresas }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Empresas interesadas</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Users :size="17" class="text-[#2447F9]" /></div>
        <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalSolicitudes }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Contactos interesados</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3"><TrendingUp :size="17" class="text-[#059669]" /></div>
        <div class="text-[26px] font-bold text-[#0F172A] leading-none">{{ totalVentas }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Ventas totales</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><BarChart3 :size="17" class="text-[#C9A227]" /></div>
        <div class="text-[26px] font-bold text-[#0F172A] leading-none">34%</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Conversión promedio</div>
      </div>
    </div>
  </div>
</template>
