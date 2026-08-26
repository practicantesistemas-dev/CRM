<script setup lang="ts">
import { Briefcase, MapPin, ClipboardList, Edit2, Clock, Trash2, ToggleRight, ToggleLeft, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Contacto } from '../types/contacto'
import { estadoStyle } from '../constants/contactos.constants'
import ContactoAvatar from '../components/ContactoAvatar.vue'

defineProps<{
  rows: Contacto[]
  paginaActual: number
  totalPaginas: number
  cambiandoEstadoId?: number | null
  puedeGestionar: boolean
  puedeEliminar: boolean
}>()

const emit = defineEmits<{
  editar: [c: Contacto]
  historial: [c: Contacto]
  seguimiento: [c: Contacto]
  'toggle-estado': [c: Contacto]
  borrar: [c: Contacto]
  'update:paginaActual': [p: number]
}>()
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[900px]">
        <thead class="bg-[#F8FAFC] dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[190px]">Contacto</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Documento</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Empresa · Cargo</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ciudad</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estado</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Etiquetas</th>
            <th class="text-left px-3 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Responsable</th>
            <th class="text-right pl-4 pr-6 py-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-[124px]">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
          <tr v-for="c in rows" :key="c.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition-colors group">
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <ContactoAvatar :nombre="c.nombre" />
                <div class="min-w-0">
                  <div class="text-[12px] font-semibold text-[#0F172A] dark:text-slate-100 truncate max-w-[130px]">{{ c.nombre }}</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[130px]">{{ c.correo }}</div>
                  <div class="text-[10px] text-slate-400 dark:text-slate-500">{{ c.telefono }}</div>
                </div>
              </div>
            </td>
            <td class="px-3 py-3">
              <div class="text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap"><span class="text-slate-400 dark:text-slate-500 mr-1">{{ c.tipoDocumento }}</span>{{ c.documento }}</div>
              <div class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">Nac: {{ c.fechaNacimiento }}</div>
            </td>
            <td class="px-3 py-3">
              <div class="text-[12px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{{ c.empresaNombre || '—' }}</div>
              <div class="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[120px]"><Briefcase :size="10" class="shrink-0" />{{ c.cargo }}</div>
            </td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[90px]"><MapPin :size="11" class="text-slate-400 dark:text-slate-500 shrink-0" />{{ c.ciudad }}</div>
            </td>
            <td class="px-3 py-3">
              <span class="text-[11px] font-semibold whitespace-nowrap" :class="estadoStyle(c.estado)">{{ c.estado }}</span>
            </td>
            <td class="px-3 py-3">
              <div class="flex flex-wrap gap-1 max-w-[85px]">
                <span v-for="tag in c.etiquetas.slice(0, 2)" :key="tag.id"
                  class="text-[10px] font-semibold" :style="{ color: tag.color }">{{ tag.nombre }}</span>
                <span v-if="c.etiquetas.length > 2"
                  class="text-[10px] font-semibold text-slate-400 dark:text-slate-500">+{{ c.etiquetas.length - 2 }}</span>
                <span v-if="c.etiquetas.length === 0" class="text-[11px] text-slate-300 dark:text-slate-600">—</span>
              </div>
            </td>
            <td class="px-3 py-3">
              <div class="flex items-center gap-1.5" :title="c.responsable">
                <ContactoAvatar :nombre="c.responsable" size="sm" />
                <span class="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[75px]">{{ c.responsable }}</span>
              </div>
            </td>
            <td class="px-3 py-3 text-right">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  v-if="puedeGestionar"
                  @click="emit('seguimiento', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#D1FAE5] dark:hover:bg-emerald-950/50 hover:text-[#059669] dark:hover:text-emerald-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shrink-0"
                  title="Registrar seguimiento"
                >
                  <ClipboardList :size="11" />
                </button>
                <button
                  v-if="puedeGestionar"
                  @click="emit('toggle-estado', c)"
                  :disabled="cambiandoEstadoId === c.id"
                  class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="c.estado === 'Activo' ? 'hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-500 dark:hover:text-red-400' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400'"
                  :title="c.estado === 'Activo' ? 'Desactivar' : 'Activar'"
                >
                  <component :is="c.estado === 'Activo' ? ToggleRight : ToggleLeft" :size="12" />
                </button>
                <button
                  v-if="puedeGestionar"
                  @click="emit('editar', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/50 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shrink-0"
                  title="Editar"
                >
                  <Edit2 :size="11" />
                </button>
                <button
                  @click="emit('historial', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-600 dark:hover:text-amber-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shrink-0"
                  title="Historial"
                >
                  <Clock :size="11" />
                </button>
                <button
                  v-if="puedeEliminar"
                  @click="emit('borrar', c)"
                  class="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all shrink-0"
                  title="Eliminar"
                >
                  <Trash2 :size="11" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td colspan="8" class="text-center py-16 text-slate-400 dark:text-slate-500 text-[12px]">No se encontraron contactos con los filtros aplicados.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 px-1 py-3 border-t border-slate-100 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900">
      <button @click="emit('update:paginaActual', paginaActual - 1)" :disabled="paginaActual <= 1"
        class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página anterior">
        <ChevronLeft :size="15" />
      </button>
      <span class="text-[11px] text-slate-400 dark:text-slate-500">Página <strong class="text-slate-600 dark:text-slate-300">{{ paginaActual }}</strong> de <strong class="text-slate-600 dark:text-slate-300">{{ totalPaginas }}</strong></span>
      <button @click="emit('update:paginaActual', paginaActual + 1)" :disabled="paginaActual >= totalPaginas"
        class="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página siguiente">
        <ChevronRight :size="15" />
      </button>
    </div>
  </div>
</template>
