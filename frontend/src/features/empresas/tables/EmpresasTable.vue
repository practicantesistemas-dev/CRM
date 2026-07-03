<script setup lang="ts">
import { MapPin, Users, Layers, Edit2, Clock } from 'lucide-vue-next'
import type { Empresa } from '../types/empresa'
import { estadoStyle } from '../constants/empresas.constants'
import EmpresaAvatar from '../components/EmpresaAvatar.vue'

defineProps<{ rows: Empresa[] }>()
const emit = defineEmits<{ editar: [e: Empresa]; historial: [e: Empresa] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[920px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">NIT</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Industria</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ciudad</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contactos</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Servicios</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="e in rows" :key="e.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <EmpresaAvatar :nombre="e.razonSocial" />
                <div>
                  <div class="text-[12px] font-semibold text-[#0F172A]">{{ e.razonSocial }}</div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1"><MapPin :size="9" /> {{ e.direccion }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ e.nit }}</td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold text-[#1E3A8A]">{{ e.industria }}</span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><MapPin :size="11" class="text-slate-400" />{{ e.ciudad }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><Users :size="11" class="text-slate-400" />{{ e.contactos }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><Layers :size="11" class="text-slate-400" />{{ e.servicios.length }}</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="estadoStyle(e.estado)">{{ e.estado }}</span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <EmpresaAvatar :nombre="e.responsable" size="sm" bg="#EEF2FF" color="#2447F9" />
                <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ e.responsable }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('editar', e)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all" title="Editar">
                  <Edit2 :size="12" />
                </button>
                <button @click="emit('historial', e)" class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 flex items-center justify-center transition-all" title="Historial">
                  <Clock :size="12" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="9" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron empresas.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
