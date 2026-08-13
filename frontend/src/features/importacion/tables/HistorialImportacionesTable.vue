<script setup lang="ts">
import { FileText, Clock, CheckCircle, AlertCircle, Download } from 'lucide-vue-next'
import type { RegistroImportacion } from '../types/importacion'
import { estadoStyle } from '../constants/importacion.constants'

defineProps<{ rows: RegistroImportacion[] }>()
</script>

<template>
  <div class="surface-card rounded-2xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead class="surface-header border-b border-default">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Archivo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Fecha</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Registros</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Exitosos</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Duplicados</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Errores</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Estado</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-subtle uppercase tracking-wider">Reporte</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="r in rows" :key="r.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-700/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="r.tipo === 'Excel' ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'bg-[#EEF2FF] dark:bg-blue-950/50'">
                  <FileText :size="14" :class="r.tipo === 'Excel' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#2447F9] dark:text-blue-400'" />
                </div>
                <div>
                  <div class="text-[12px] font-semibold text-heading truncate max-w-[200px]">{{ r.archivo }}</div>
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" :class="r.tipo === 'Excel' ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' : 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'">{{ r.tipo }}</span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-subtle"><Clock :size="11" class="text-slate-400 dark:text-slate-500" />{{ r.fecha }}</div>
            </td>
            <td class="px-4 py-3.5 text-[12px] font-bold text-heading">{{ r.registros.toLocaleString('es-CO') }}</td>
            <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">{{ r.exitosos.toLocaleString('es-CO') }}</span></td>
            <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-amber-600 dark:text-amber-400">{{ r.duplicados }}</span></td>
            <td class="px-4 py-3.5">
              <span class="text-[12px] font-bold" :class="r.errores > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'">{{ r.errores }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="estadoStyle(r.estado)">
                <CheckCircle v-if="r.estado === 'Completado'" :size="9" />
                <AlertCircle v-else-if="r.estado === 'Con errores'" :size="9" />
                {{ r.estado }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button v-if="r.errores > 0" class="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-default text-[10px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                <Download :size="11" /> Errores
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
