<script setup lang="ts">
import { Briefcase, MapPin, ClipboardList, Edit2, Clock, Trash2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Contacto } from '../types/contacto'
import { estadoStyle } from '../constants/contactos.constants'
import ContactoAvatar from '../components/ContactoAvatar.vue'

defineProps<{
  rows: Contacto[]
  paginaActual: number
  totalPaginas: number
}>()

const emit = defineEmits<{
  editar: [c: Contacto]
  historial: [c: Contacto]
  seguimiento: [c: Contacto]
  borrar: [c: Contacto]
  'update:paginaActual': [p: number]
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[860px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[190px]">Contacto</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documento</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa · Cargo</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ciudad</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etiquetas</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
            <th class="text-right pl-4 pr-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[84px]">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <ContactoAvatar :nombre="c.nombre" />
                <div class="min-w-0">
                  <div class="text-[12px] font-semibold text-[#0F172A] truncate max-w-[130px]">{{ c.nombre }}</div>
                  <div class="text-[11px] text-slate-400 truncate max-w-[130px]">{{ c.correo }}</div>
                  <div class="text-[10px] text-slate-400">{{ c.telefono }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 py-3">
              <div class="text-[11px] text-slate-500 font-medium whitespace-nowrap"><span class="text-slate-400 mr-1">{{ c.tipoDocumento }}</span>{{ c.documento }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">Nac: {{ c.fechaNacimiento }}</div>
            </td>
            <td class="px-3 py-3">
              <div class="text-[12px] font-semibold text-slate-700 truncate max-w-[120px]">{{ c.empresaNombre || '—' }}</div>
              <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[120px]"><Briefcase :size="10" class="shrink-0" />{{ c.cargo }}</div>
            </td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-1 text-[11px] text-slate-600 truncate max-w-[90px]"><MapPin :size="11" class="text-slate-400 shrink-0" />{{ c.ciudad }}</div>
            </td>
            <td class="px-3 py-3">
              <span class="text-[11px] font-semibold whitespace-nowrap" :class="estadoStyle(c.estado)">{{ c.estado }}</span>
            </td>
            <td class="px-3 py-3">
              <div class="flex flex-wrap gap-1 max-w-[85px]">
                <span v-for="tag in c.etiquetas.slice(0, 2)" :key="tag.id"
                  class="text-[10px] font-semibold" :style="{ color: tag.color }">{{ tag.nombre }}</span>
                <span v-if="c.etiquetas.length > 2"
                  class="text-[10px] font-semibold text-slate-400">+{{ c.etiquetas.length - 2 }}</span>
                <span v-if="c.etiquetas.length === 0" class="text-[11px] text-slate-300">—</span>
              </div>
            </td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-1.5">
                <ContactoAvatar :nombre="c.responsable" size="sm" />
                <span class="text-[11px] text-slate-600 truncate max-w-[75px]">{{ c.responsable }}</span>
              </div>
            </td>
            <td class="px-3 py-3 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="emit('seguimiento', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-[#D1FAE5] hover:text-[#059669] text-slate-500 flex items-center justify-center transition-all shrink-0"
                  title="Registrar seguimiento"
                >
                  <ClipboardList :size="11" />
                </button>
                <button
                  @click="emit('editar', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all shrink-0"
                  title="Editar"
                >
                  <Edit2 :size="11" />
                </button>
                <button
                  @click="emit('historial', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 flex items-center justify-center transition-all shrink-0"
                  title="Historial"
                >
                  <Clock :size="11" />
                </button>
                <button
                  @click="emit('borrar', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all shrink-0"
                  title="Eliminar"
                >
                  <Trash2 :size="11" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="8" class="text-center py-16 text-slate-400 text-[12px]">No se encontraron contactos con los filtros aplicados.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 px-1 py-3 border-t border-slate-100 bg-[#F8FAFC]">
      <button @click="emit('update:paginaActual', paginaActual - 1)" :disabled="paginaActual <= 1"
        class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página anterior">
        <ChevronLeft :size="15" />
      </button>
      <span class="text-[11px] text-slate-400">Página <strong class="text-slate-600">{{ paginaActual }}</strong> de <strong class="text-slate-600">{{ totalPaginas }}</strong></span>
      <button @click="emit('update:paginaActual', paginaActual + 1)" :disabled="paginaActual >= totalPaginas"
        class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página siguiente">
        <ChevronRight :size="15" />
      </button>
    </div>
  </div>
</template>
