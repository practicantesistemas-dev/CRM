<script setup lang="ts">
import { Layers, Edit2 } from 'lucide-vue-next'
import type { Servicio } from '../types/servicio'
import { estadoStyle, tipoColor } from '../constants/servicios.constants'

defineProps<{ rows: Servicio[] }>()
const emit = defineEmits<{ editar: [s: Servicio]; 'toggle-estado': [s: Servicio] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[960px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Servicio</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Código</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Solicitudes</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Conversión</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in rows" :key="s.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] text-[#C9A227] font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                  <Layers :size="16" />
                </div>
                <div>
                  <div class="text-[12px] font-semibold text-[#0F172A]">{{ s.nombre }}</div>
                  <div class="text-[10px] text-slate-400">{{ s.valorPotencial }} potencial</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600 font-mono font-medium">{{ s.codigo }}</td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="tipoColor(s.tipo)">{{ s.tipo }}</span>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600">{{ s.categoria }}</td>
            <td class="px-4 py-3.5">
              <div class="text-[12px] font-bold text-[#0F172A]">{{ s.solicitudes }}</div>
              <div class="text-[10px] text-slate-400">{{ s.ventas }} ventas</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[12px] font-bold text-emerald-600">{{ s.conversion }}</span>
            </td>
            <td class="px-4 py-3.5">
              <button @click="emit('toggle-estado', s)" class="text-[11px] font-semibold hover:opacity-70 cursor-pointer transition-opacity" :class="estadoStyle(s.estado)">{{ s.estado }}</button>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[8px] font-bold flex items-center justify-center flex-shrink-0">
                  {{ s.responsable.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ s.responsable }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('editar', s)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="12" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron servicios.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
