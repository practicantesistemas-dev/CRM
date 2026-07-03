<script setup lang="ts">
import type { Actividad, TipoActividad } from '../types/actividad'
import { TIPOS_ACTIVIDAD, TIPO_META } from '../constants/relacionamiento.constants'

defineProps<{ actividades: Actividad[]; filtroTipo: TipoActividad | 'todos' }>()
const emit = defineEmits<{ 'update:filtroTipo': [tipo: TipoActividad | 'todos'] }>()
</script>

<template>
  <div class="flex gap-2 flex-wrap">
    <button
      @click="emit('update:filtroTipo', 'todos')"
      class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold transition-all"
      :class="filtroTipo === 'todos' ? 'bg-[#2447F9] text-white shadow' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#2447F9] hover:text-[#2447F9]'"
    >
      Todos ({{ actividades.length }})
    </button>
    <button
      v-for="tipo in TIPOS_ACTIVIDAD"
      :key="tipo"
      @click="emit('update:filtroTipo', tipo)"
      class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold transition-all"
      :class="filtroTipo === tipo
        ? 'text-white shadow'
        : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700'"
      :style="filtroTipo === tipo ? { backgroundColor: TIPO_META[tipo].color } : {}"
    >
      <component :is="TIPO_META[tipo].icono" :size="11" />
      {{ tipo }} ({{ actividades.filter(a => a.tipo === tipo).length }})
    </button>
  </div>
</template>
