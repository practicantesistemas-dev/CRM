<script setup lang="ts">
import { Mail, Users, ChevronRight } from 'lucide-vue-next'
import type { Campana } from '../types/campana'
import { estadoStyle, tasaApertura, tasaClic } from '../constants/campanas.constants'

defineProps<{ campana: Campana }>()
const emit = defineEmits<{ editar: [] }>()
</script>

<template>
  <div class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors group">
    <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
      <Mail :size="17" class="text-[#2447F9]" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-[12px] font-bold text-[#0F172A] truncate">{{ campana.nombre }}</span>
        <span class="text-[10px] font-semibold flex-shrink-0" :class="estadoStyle(campana.estado)">{{ campana.estado }}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px] text-slate-400">
        <Users :size="10" />{{ campana.segmento }}
        <span v-if="campana.fecha">· {{ campana.fecha }}</span>
      </div>
    </div>

    <div v-if="campana.estado === 'Enviada'" class="hidden sm:flex items-center gap-6">
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#0F172A]">{{ campana.enviados.toLocaleString('es-CO') }}</div>
        <div class="text-[9px] text-slate-400 uppercase tracking-wide">Enviados</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#EC4899]">{{ tasaApertura(campana) }}</div>
        <div class="text-[9px] text-slate-400 uppercase tracking-wide">Apertura</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#059669]">{{ tasaClic(campana) }}</div>
        <div class="text-[9px] text-slate-400 uppercase tracking-wide">Clics</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#C9A227]">{{ campana.rebotes }}</div>
        <div class="text-[9px] text-slate-400 uppercase tracking-wide">Rebotes</div>
      </div>
    </div>

    <button @click="emit('editar')" class="flex items-center gap-1 h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
      Editar <ChevronRight :size="11" />
    </button>
  </div>
</template>
