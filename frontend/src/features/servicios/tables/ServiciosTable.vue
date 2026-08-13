<script setup lang="ts">
import { Layers, Edit2 } from 'lucide-vue-next'
import type { Servicio } from '../types/servicio'
import { estadoStyle, tipoColor } from '../constants/servicios.constants'

defineProps<{ rows: Servicio[] }>()
const emit = defineEmits<{ editar: [s: Servicio]; 'toggle-estado': [s: Servicio] }>()
</script>

<template>
  <div class="surface-card rounded-2xl shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[960px]">
        <thead class="surface-header border-b border-default">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Servicio</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tipo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solicitudes</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversión</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Responsable</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="s in rows" :key="s.id" class="surface-hover transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] dark:bg-amber-950/50 text-[#C9A227] dark:text-amber-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  <Layers :size="16" />
                </div>
                <div>
                  <div class="text-[12px] font-semibold text-heading">{{ s.nombre }}</div>
                  <div class="text-[10px] text-muted">{{ s.valorPotencial }} potencial</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-body font-mono font-medium">{{ s.codigo }}</td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="tipoColor(s.tipo)">{{ s.tipo }}</span>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-body">{{ s.categoria }}</td>
            <td class="px-4 py-3.5">
              <div class="text-[12px] font-bold text-heading">{{ s.solicitudes }}</div>
              <div class="text-[10px] text-muted">{{ s.ventas }} ventas</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">{{ s.conversion }}</span>
            </td>
            <td class="px-4 py-3.5">
              <button @click="emit('toggle-estado', s)" class="text-[11px] font-semibold hover:opacity-70 cursor-pointer transition-opacity" :class="estadoStyle(s.estado)">{{ s.estado }}</button>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-[#EEF2FF] dark:bg-blue-950/50 text-[#2447F9] dark:text-blue-400 text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                  {{ s.responsable.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-[11px] text-body truncate max-w-[100px]">{{ s.responsable }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('editar', s)" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/50 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="12" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="text-center py-16 text-muted text-[12px]">No se encontraron servicios.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
