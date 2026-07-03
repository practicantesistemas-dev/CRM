<script setup lang="ts">
import { Edit2, ToggleLeft, ToggleRight, RefreshCw, History } from 'lucide-vue-next'
import type { Beneficiario } from '../types/plan-liga'
import { estadoBeneStyle } from '../constants/plan-liga.constants'
import PersonaAvatar from './PersonaAvatar.vue'

defineProps<{ beneficiario: Beneficiario }>()
const emit = defineEmits<{
  editar: []
  activar: []
  desactivar: []
  reemplazar: []
}>()
</script>

<template>
  <div
    class="bg-white rounded-xl border border-slate-200 p-4 group hover:shadow-sm transition-all"
    :class="beneficiario.estado === 'Retirado' || beneficiario.estado === 'Reemplazado' ? 'opacity-60' : ''"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-3 min-w-0">
        <PersonaAvatar :nombre="beneficiario.nombre" size="sm" bg="#EEF2FF" color="#2447F9" />
        <div class="min-w-0">
          <div class="text-[12px] font-semibold text-[#0F172A] truncate">{{ beneficiario.nombre }}</div>
          <div class="text-[10px] text-slate-400">{{ beneficiario.documento }} · {{ beneficiario.parentesco }}</div>
          <div class="text-[10px] text-slate-400">Nac: {{ beneficiario.fechaNacimiento }}</div>
        </div>
      </div>
      <span class="text-[10px] font-semibold shrink-0" :class="estadoBeneStyle(beneficiario.estado)">{{ beneficiario.estado }}</span>
    </div>
    <div class="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
      <button @click="emit('editar')" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 text-[10px] font-semibold transition-all"><Edit2 :size="10" /> Editar</button>
      <button v-if="beneficiario.estado === 'Activo'" @click="emit('desactivar')" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 text-[10px] font-semibold transition-all"><ToggleLeft :size="10" /> Desactivar</button>
      <button v-else-if="beneficiario.estado === 'Inactivo'" @click="emit('activar')" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 text-slate-500 text-[10px] font-semibold transition-all"><ToggleRight :size="10" /> Activar</button>
      <button v-if="beneficiario.estado === 'Activo'" @click="emit('reemplazar')" class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 text-[10px] font-semibold transition-all"><RefreshCw :size="10" /> Reemplazar</button>
      <button class="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 text-[10px] font-semibold transition-all"><History :size="10" /> Historial</button>
    </div>
  </div>
</template>
