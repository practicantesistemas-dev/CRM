<script setup lang="ts">
import { Edit2, Loader2, ToggleLeft, ToggleRight, Users, ClipboardList } from 'lucide-vue-next'
import type { Titular } from '../types/plan-liga'
import { estadoTitularStyle, planStyle } from '../constants/plan-liga.constants'
import PersonaAvatar from '../components/PersonaAvatar.vue'
import CuposIndicador from '../components/CuposIndicador.vue'

defineProps<{
  rows: Titular[]
  activosPorTitular: (id: number) => number
  cargandoEditarId?: number | null
}>()

const emit = defineEmits<{
  seguimiento: [t: Titular]
  editar: [t: Titular]
  'toggle-estado': [t: Titular]
  beneficiarios: [t: Titular]
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[1000px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Titular</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documento</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Plan</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Beneficiarios</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inscripción</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="t in rows" :key="t.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <PersonaAvatar :nombre="t.nombre" />
                <div>
                  <div class="text-[12px] font-semibold text-[#0F172A]">{{ t.nombre }}</div>
                  <div class="text-[10px] text-slate-400">{{ t.correo }}</div>
                  <div class="text-[10px] text-slate-400">{{ t.telefono }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600 font-medium">{{ t.documento }}</td>
            <td class="px-4 py-3.5 text-[11px] text-slate-600 truncate max-w-[140px]">{{ t.empresa }}</td>
            <td class="px-4 py-3.5">
              <div v-if="t.planesDetalle?.length" class="flex flex-col gap-0.5">
                <span v-for="p in t.planesDetalle" :key="p.nombre" class="text-[11px] font-semibold" :class="planStyle(p.nombre)">
                  {{ p.nombre }} <span class="text-slate-400 font-medium">({{ p.activos }}/{{ p.cupo }})</span>
                </span>
              </div>
              <span v-else class="text-[11px] font-semibold" :class="planStyle(t.planContratado)">{{ t.planContratado }}</span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-2">
                <CuposIndicador :activos="activosPorTitular(t.id)" variant="dots" />
                <span class="text-[11px] font-bold" :class="activosPorTitular(t.id) >= 4 ? 'text-[#EC4899]' : 'text-slate-600'">{{ activosPorTitular(t.id) }}/4</span>
              </div>
              <button @click="emit('beneficiarios', t)" class="text-[10px] text-[#2447F9] hover:underline mt-0.5 block">Ver beneficiarios</button>
            </td>
            <td class="px-4 py-3.5 text-[11px] text-slate-500">{{ t.fechaInscripcion }}</td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="estadoTitularStyle(t.estado)">{{ t.estado }}</span>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="emit('seguimiento', t)"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#D1FAE5] hover:text-[#059669] text-slate-500 flex items-center justify-center transition-all"
                  title="Registrar seguimiento">
                  <ClipboardList :size="12" />
                </button>
                <button @click="emit('editar', t)" :disabled="cargandoEditarId === t.id"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all disabled:opacity-60"
                  title="Editar">
                  <Loader2 v-if="cargandoEditarId === t.id" :size="12" class="animate-spin" />
                  <Edit2 v-else :size="12" />
                </button>
                <button @click="emit('toggle-estado', t)"
                  class="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center transition-all"
                  :class="t.estado === 'Activo' ? 'hover:bg-red-50 hover:text-red-500' : 'hover:bg-emerald-50 hover:text-emerald-600'"
                  :title="t.estado === 'Activo' ? 'Desactivar' : 'Activar'">
                  <component :is="t.estado === 'Activo' ? ToggleRight : ToggleLeft" :size="14" />
                </button>
                <button @click="emit('beneficiarios', t)"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#FCE7F3] hover:text-[#EC4899] text-slate-500 flex items-center justify-center transition-all"
                  title="Beneficiarios"><Users :size="12" /></button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="8" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron titulares.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
