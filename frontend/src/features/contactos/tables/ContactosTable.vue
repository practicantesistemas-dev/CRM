<script setup lang="ts">
import { Briefcase, MapPin, ClipboardList, Edit2, Clock } from 'lucide-vue-next'
import type { Contacto } from '../types/contacto'
import { estadoStyle, etiquetaColor } from '../constants/contactos.constants'
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
  'update:paginaActual': [p: number]
}>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[1000px]">
        <thead class="bg-[#F8FAFC] border-b border-slate-200">
          <tr>
            <th class="text-left px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[220px]">Contacto</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Documento</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa · Cargo</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ciudad</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Etiquetas</th>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
            <th class="text-right px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-50/60 transition-colors group">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <ContactoAvatar :nombre="c.nombre" />
                <div class="min-w-0">
                  <div class="text-[12px] font-semibold text-[#0F172A] truncate">{{ c.nombre }}</div>
                  <div class="text-[11px] text-slate-400 truncate">{{ c.correo }}</div>
                  <div class="text-[10px] text-slate-400">{{ c.telefono }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="text-[11px] text-slate-500 font-medium"><span class="text-slate-400 mr-1">{{ c.tipoDocumento }}</span>{{ c.documento }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Nac: {{ c.fechaNacimiento }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="text-[12px] font-semibold text-slate-700 truncate max-w-[160px]">{{ c.empresa }}</div>
              <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Briefcase :size="10" />{{ c.cargo }}</div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1 text-[11px] text-slate-600"><MapPin :size="11" class="text-slate-400" />{{ c.ciudad }}</div>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-[11px] font-semibold" :class="estadoStyle(c.estado)">{{ c.estado }}</span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex flex-wrap gap-1">
                <span v-for="tag in c.etiquetas.slice(0, 2)" :key="tag"
                  class="text-[10px] font-semibold" :class="etiquetaColor(tag)">{{ tag }}</span>
                <span v-if="c.etiquetas.length > 2"
                  class="text-[10px] font-semibold text-slate-400">+{{ c.etiquetas.length - 2 }}</span>
                <span v-if="c.etiquetas.length === 0" class="text-[11px] text-slate-300">—</span>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <ContactoAvatar :nombre="c.responsable" size="sm" />
                <span class="text-[11px] text-slate-600 truncate max-w-[100px]">{{ c.responsable }}</span>
              </div>
            </td>
            <td class="px-5 py-3.5 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="emit('seguimiento', c)"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#D1FAE5] hover:text-[#059669] text-slate-500 flex items-center justify-center transition-all"
                  title="Registrar seguimiento"
                >
                  <ClipboardList :size="12" />
                </button>
                <button
                  @click="emit('editar', c)"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all"
                  title="Editar"
                >
                  <Edit2 :size="12" />
                </button>
                <button
                  @click="emit('historial', c)"
                  class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-500 flex items-center justify-center transition-all"
                  title="Historial"
                >
                  <Clock :size="12" />
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
    <div v-if="totalPaginas > 1" class="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-[#F8FAFC]">
      <span class="text-[11px] text-slate-500">Página {{ paginaActual }} de {{ totalPaginas }}</span>
      <div class="flex gap-1">
        <button v-for="p in totalPaginas" :key="p" @click="emit('update:paginaActual', p)"
          class="w-7 h-7 rounded-lg text-[11px] font-semibold transition-all"
          :class="p === paginaActual ? 'bg-[#2447F9] text-white shadow' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2447F9] hover:text-[#2447F9]'">{{ p }}</button>
      </div>
    </div>
  </div>
</template>
