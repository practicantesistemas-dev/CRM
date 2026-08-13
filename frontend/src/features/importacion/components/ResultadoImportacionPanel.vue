<script setup lang="ts">
import { CheckCircle, AlertCircle, Download } from 'lucide-vue-next'
import type { ResultadoImportacion } from '../types/importacion'

defineProps<{ resultado: ResultadoImportacion }>()
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm p-6">
    <div class="flex items-center gap-2 mb-4">
      <CheckCircle :size="18" class="text-emerald-600 dark:text-emerald-400" />
      <h3 class="text-[13px] font-bold text-heading">Importación completada</h3>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="text-center p-3 surface-sunken rounded-xl">
        <div class="text-[22px] font-bold text-heading">{{ resultado.registros }}</div>
        <div class="text-[10px] text-subtle uppercase tracking-wide mt-0.5">Registros totales</div>
      </div>
      <div class="text-center p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
        <div class="text-[22px] font-bold text-emerald-700 dark:text-emerald-300">{{ resultado.exitosos }}</div>
        <div class="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mt-0.5">Exitosos</div>
      </div>
      <div class="text-center p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl">
        <div class="text-[22px] font-bold text-amber-700 dark:text-amber-300">{{ resultado.duplicados }}</div>
        <div class="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wide mt-0.5">Duplicados</div>
      </div>
      <div class="text-center p-3 bg-red-50 dark:bg-red-950/40 rounded-xl">
        <div class="text-[22px] font-bold text-red-700 dark:text-red-300">{{ resultado.errores }}</div>
        <div class="text-[10px] text-red-600 dark:text-red-400 uppercase tracking-wide mt-0.5">Errores</div>
      </div>
    </div>
    <div v-if="resultado.errores > 0" class="mt-4 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
      <AlertCircle :size="15" class="text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <p class="text-[11px] text-amber-700 dark:text-amber-300">Se encontraron <strong>{{ resultado.errores }} registros con errores</strong>. Descarga el reporte para ver el detalle.</p>
      <button class="ml-auto flex items-center gap-1 h-7 px-3 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold hover:bg-amber-200 dark:hover:bg-amber-800 transition-all flex-shrink-0">
        <Download :size="11" /> Reporte
      </button>
    </div>
  </div>
</template>
