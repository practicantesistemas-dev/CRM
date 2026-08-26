<script setup lang="ts">
import { Mail, Users, ChevronRight } from 'lucide-vue-next'
import type { Campana } from '../types/campana'
import { estadoStyle, tasaApertura, tasaClic } from '../constants/campanas.constants'
import { permisosDeModulo } from '@/features/auth/composables/useAuth'

defineProps<{ campana: Campana }>()
const emit = defineEmits<{ editar: [] }>()

const { gestionar: puedeGestionar } = permisosDeModulo('campanas')
</script>

<template>
  <div class="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-700/60 transition-colors group">
    <div class="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
      <Mail :size="17" class="text-[#2447F9] dark:text-blue-400" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-0.5">
        <span class="text-[12px] font-bold text-heading truncate">{{ campana.nombre }}</span>
        <span class="text-[10px] font-semibold flex-shrink-0" :class="estadoStyle(campana.estado)">{{ campana.estado }}</span>
      </div>
      <div class="flex items-center gap-2 text-[10px] text-muted">
        <Users :size="10" />{{ campana.segmento }}
        <span v-if="campana.fecha">· {{ campana.fecha }}</span>
      </div>
    </div>

    <div v-if="campana.estado === 'Enviada'" class="hidden sm:flex items-center gap-6">
      <div class="text-center">
        <div class="text-[13px] font-bold text-heading">{{ campana.enviados.toLocaleString('es-CO') }}</div>
        <div class="text-[9px] text-muted uppercase tracking-wide">Enviados</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#EC4899] dark:text-pink-400">{{ tasaApertura(campana) }}</div>
        <div class="text-[9px] text-muted uppercase tracking-wide">Apertura</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#059669] dark:text-emerald-400">{{ tasaClic(campana) }}</div>
        <div class="text-[9px] text-muted uppercase tracking-wide">Clics</div>
      </div>
      <div class="text-center">
        <div class="text-[13px] font-bold text-[#C9A227] dark:text-amber-400">{{ campana.rebotes }}</div>
        <div class="text-[9px] text-muted uppercase tracking-wide">Rebotes</div>
      </div>
    </div>

    <button
      v-if="puedeGestionar"
      @click="emit('editar')"
      class="flex items-center gap-1 h-8 px-3 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
    >
      Editar <ChevronRight :size="11" />
    </button>
  </div>
</template>
