<script setup lang="ts">
import { Copy, X, Users, Download } from 'lucide-vue-next'
import type { Segmento } from '../types/segmento'

defineProps<{ segmento: Segmento }>()
const emit = defineEmits<{ duplicar: []; eliminar: []; cargar: [] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all group">
    <div class="flex items-start justify-between mb-3">
      <div>
        <div class="text-[13px] font-bold text-[#0F172A]">{{ segmento.nombre }}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">Creado {{ segmento.creadoEn }}</div>
      </div>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="emit('duplicar')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-400 flex items-center justify-center transition-all" title="Duplicar"><Copy :size="11" /></button>
        <button @click="emit('eliminar')" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all" title="Eliminar"><X :size="11" /></button>
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5 mb-3">
      <span v-if="segmento.servicio !== 'todos'"    class="text-[10px] font-semibold text-[#1E3A8A]">{{ segmento.servicio }}</span>
      <span v-if="segmento.estado !== 'todos'"      class="text-[10px] font-semibold text-[#065F46]">{{ segmento.estado }}</span>
      <span v-if="segmento.etiqueta !== 'todos'"    class="text-[10px] font-semibold text-[#92400E]">{{ segmento.etiqueta }}</span>
      <span v-if="segmento.ciudad !== 'todas'"      class="text-[10px] font-semibold text-slate-500">{{ segmento.ciudad }}</span>
      <span v-if="segmento.responsable !== 'todos'" class="text-[10px] font-semibold text-[#9D174D]">{{ segmento.responsable }}</span>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <Users :size="13" class="text-[#2447F9]" />
        <span class="text-[13px] font-bold text-[#0F172A]">{{ segmento.total.toLocaleString('es-CO') }}</span>
        <span class="text-[11px] text-slate-400">contactos</span>
      </div>
      <div class="flex gap-1">
        <button @click="emit('cargar')" class="h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cargar</button>
        <button class="h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="11" />
        </button>
      </div>
    </div>
  </div>
</template>
