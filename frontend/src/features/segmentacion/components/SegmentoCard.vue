<script setup lang="ts">
import { Copy, X, Users, Download } from 'lucide-vue-next'
import type { Segmento } from '../types/segmento'

defineProps<{ segmento: Segmento }>()
const emit = defineEmits<{ duplicar: []; eliminar: []; cargar: [] }>()
</script>

<template>
  <div class="surface-card rounded-2xl shadow-sm p-4 hover:shadow-md transition-all group">
    <div class="flex items-start justify-between mb-3">
      <div>
        <div class="text-[13px] font-bold text-heading">{{ segmento.nombre }}</div>
        <div class="text-[10px] text-muted mt-0.5">Creado {{ segmento.creadoEn }}</div>
      </div>
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="emit('duplicar')" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/40 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all" title="Duplicar"><Copy :size="11" /></button>
        <button @click="emit('eliminar')" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 text-slate-400 dark:text-slate-500 flex items-center justify-center transition-all" title="Eliminar"><X :size="11" /></button>
      </div>
    </div>

    <div class="flex flex-wrap gap-1.5 mb-3">
      <span v-if="segmento.servicio !== 'todos'"    class="text-[10px] font-semibold text-[#1E3A8A] dark:text-blue-300">{{ segmento.servicio }}</span>
      <span v-if="segmento.estado !== 'todos'"      class="text-[10px] font-semibold text-[#065F46] dark:text-emerald-400">{{ segmento.estado }}</span>
      <span v-if="segmento.etiqueta !== 'todos'"    class="text-[10px] font-semibold text-[#92400E] dark:text-amber-400">{{ segmento.etiqueta }}</span>
      <span v-if="segmento.ciudad !== 'todas'"      class="text-[10px] font-semibold text-subtle">{{ segmento.ciudad }}</span>
      <span v-if="segmento.responsable !== 'todos'" class="text-[10px] font-semibold text-[#9D174D] dark:text-pink-300">{{ segmento.responsable }}</span>
    </div>

    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <Users :size="13" class="text-[#2447F9] dark:text-blue-400" />
        <span class="text-[13px] font-bold text-heading">{{ segmento.total.toLocaleString('es-CO') }}</span>
        <span class="text-[11px] text-muted">contactos</span>
      </div>
      <div class="flex gap-1">
        <button @click="emit('cargar')" class="h-7 px-2.5 rounded-lg border border-default text-[10px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cargar</button>
        <button class="h-7 px-2.5 rounded-lg border border-default text-[10px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          <Download :size="11" />
        </button>
      </div>
    </div>
  </div>
</template>
