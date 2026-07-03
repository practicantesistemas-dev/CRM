<script setup lang="ts">
import { Search, X, Users, SlidersHorizontal } from 'lucide-vue-next'
import type { FiltrosSegmento } from '../types/segmento'
import {
  SERVICIOS_OPTIONS, ESTADOS_OPTIONS, ETIQUETAS_OPTIONS, CIUDADES_OPTIONS, RESPONSABLES_OPTIONS,
} from '../constants/segmentacion.constants'

defineProps<{ filtrosActivos: number; resultado: number }>()
const emit = defineEmits<{ limpiar: [] }>()

const filtros = defineModel<FiltrosSegmento>('filtros', { required: true })
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
    <div class="flex items-center gap-2 mb-4">
      <SlidersHorizontal :size="15" class="text-[#2447F9]" />
      <h3 class="text-[13px] font-bold text-[#0F172A]">Filtros de segmentación</h3>
      <span v-if="filtrosActivos > 0" class="bg-[#2447F9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{{ filtrosActivos }} activos</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Empresa</label>
        <div class="relative">
          <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="filtros.empresa" placeholder="Buscar empresa..." class="w-full h-9 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Servicio</label>
        <select v-model="filtros.servicio" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="todos">Todos los servicios</option>
          <option v-for="s in SERVICIOS_OPTIONS" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Estado</label>
        <select v-model="filtros.estado" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="todos">Todos los estados</option>
          <option v-for="e in ESTADOS_OPTIONS" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Etiqueta</label>
        <select v-model="filtros.etiqueta" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="todos">Todas las etiquetas</option>
          <option v-for="e in ETIQUETAS_OPTIONS" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Ciudad</label>
        <select v-model="filtros.ciudad" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="todas">Todas las ciudades</option>
          <option v-for="c in CIUDADES_OPTIONS" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Responsable</label>
        <select v-model="filtros.responsable" class="w-full h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="todos">Todos</option>
          <option v-for="r in RESPONSABLES_OPTIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
      <div class="flex items-center gap-2">
        <Users :size="15" class="text-[#2447F9]" />
        <span class="text-[13px] font-bold text-[#0F172A]">{{ resultado.toLocaleString('es-CO') }}</span>
        <span class="text-[12px] text-slate-500">contactos en este segmento</span>
      </div>
      <button v-if="filtrosActivos > 0" @click="emit('limpiar')" class="flex items-center gap-1 h-8 px-3 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-500 hover:bg-red-100 transition-all">
        <X :size="11" /> Limpiar filtros
      </button>
    </div>
  </div>
</template>
