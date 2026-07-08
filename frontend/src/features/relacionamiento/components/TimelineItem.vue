<script setup lang="ts">
import { computed } from 'vue'
import { Target } from 'lucide-vue-next'
import type { Actividad } from '../types/actividad'
import { TIPO_META } from '../constants/relacionamiento.constants'
import { getOportunidades } from '@/features/oportunidades/services/oportunidades.api'
import { clienteLabel } from '@/features/oportunidades/constants/oportunidades.constants'

const props = defineProps<{ actividad: Actividad }>()

const oportunidad = computed(() => getOportunidades().find(o => o.id === props.actividad.oportunidadId) ?? null)

const sujetos = computed(() => [props.actividad.contactoNombre, props.actividad.empresaNombre, props.actividad.titularNombre].filter(Boolean))
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 hover:shadow-md transition-all">
    <div class="flex-shrink-0">
      <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ backgroundColor: TIPO_META[actividad.tipo].bg }">
        <component :is="TIPO_META[actividad.tipo].icono" :size="16" :style="{ color: TIPO_META[actividad.tipo].color }" />
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] font-bold uppercase tracking-wide" :style="{ color: TIPO_META[actividad.tipo].color }">{{ actividad.tipo }}</span>
          <template v-for="(s, i) in sujetos" :key="i">
            <span class="text-[11px] text-slate-400">·</span>
            <span :class="i === 0 ? 'text-[12px] font-bold text-[#0F172A]' : 'text-[11px] text-slate-500'">{{ s }}</span>
          </template>
          <span v-if="sujetos.length === 0" class="text-[11px] text-slate-400 italic">Sin contacto, empresa o titular asociado</span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class="text-[10px] text-slate-400">{{ actividad.fecha }}</span>
          <div class="flex items-center gap-1">
            <div class="w-5 h-5 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[7px] font-bold flex items-center justify-center">
              {{ actividad.usuario.split(' ').map(n => n[0]).join('') }}
            </div>
            <span class="text-[10px] text-slate-400">{{ actividad.usuario }}</span>
          </div>
        </div>
      </div>

      <p class="text-[12px] text-slate-700 mb-2">{{ actividad.accion }}</p>

      <div v-if="oportunidad" class="flex items-center gap-1.5 mb-2">
        <Target :size="11" class="text-[#2447F9] flex-shrink-0" />
        <span class="text-[11px] text-[#2447F9] font-semibold">{{ oportunidad.servicio }}</span>
        <span class="text-[10px] text-slate-400">· {{ clienteLabel(oportunidad) }}</span>
      </div>

      <div v-if="actividad.proximoPaso" class="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wide flex-shrink-0">Próx. paso:</span>
        <span class="text-[11px] text-[#2447F9] font-medium">{{ actividad.proximoPaso }}</span>
      </div>
    </div>
  </div>
</template>
