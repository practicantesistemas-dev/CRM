<script setup lang="ts">
import { FileText, Clock, CheckCircle, AlertCircle, Download } from 'lucide-vue-next'
import type { RegistroImportacion } from '../types/importacion'
import { estadoStyle } from '../constants/importacion.constants'

defineProps<{ rows: RegistroImportacion[] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[700px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Archivo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Registros</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Exitosos</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duplicados</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Errores</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reporte</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in rows" :key="r.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="r.tipo === 'Excel' ? 'bg-emerald-50' : 'bg-[#EEF2FF]'">
                  <FileText :size="14" :class="r.tipo === 'Excel' ? 'text-emerald-600' : 'text-[#2447F9]'" />
                </div>
                <div>
                  <div class="text-[12px] font-semibold text-[#0F172A] truncate max-w-[200px]">{{ r.archivo }}</div>
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" :class="r.tipo === 'Excel' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'">{{ r.tipo }}</span>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-500"><Clock :size="11" class="text-slate-400" />{{ r.fecha }}</div>
            </td>
            <td class="px-4 py-3.5 text-[12px] font-bold text-[#0F172A]">{{ r.registros.toLocaleString('es-CO') }}</td>
            <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-emerald-600">{{ r.exitosos.toLocaleString('es-CO') }}</span></td>
            <td class="px-4 py-3.5"><span class="text-[12px] font-bold text-amber-600">{{ r.duplicados }}</span></td>
            <td class="px-4 py-3.5">
              <span class="text-[12px] font-bold" :class="r.errores > 0 ? 'text-red-600' : 'text-slate-400'">{{ r.errores }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="estadoStyle(r.estado)">
                <CheckCircle v-if="r.estado === 'Completado'" :size="9" />
                <AlertCircle v-else-if="r.estado === 'Con errores'" :size="9" />
                {{ r.estado }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <button v-if="r.errores > 0" class="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                <Download :size="11" /> Errores
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
