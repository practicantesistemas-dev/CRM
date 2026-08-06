<script setup lang="ts">
import { computed } from 'vue'
import { Target, Trash2, Pencil, AlarmClock } from 'lucide-vue-next'
import type { Actividad } from '../types/actividad'
import { TIPO_META } from '../constants/relacionamiento.constants'
import { getOportunidades } from '@/features/oportunidades/services/oportunidades.api'
import { clienteLabel } from '@/features/oportunidades/constants/oportunidades.constants'

const props = defineProps<{ actividad: Actividad }>()
const emit = defineEmits<{ eliminar: []; editar: [] }>()

const oportunidad = computed(() => getOportunidades().find(o => o.id === props.actividad.oportunidadId) ?? null)

const sujetos = computed(() => [props.actividad.contactoNombre, props.actividad.empresaNombre, props.actividad.titularNombre].filter(Boolean))

// Vencido: la fecha límite del próximo paso ya pasó. Hoy: vence hoy mismo. El resto no
// resalta (aún hay margen), solo se distingue vencido/hoy porque son los que requieren acción.
const hoy = new Date().toISOString().split('T')[0]
const estadoProximoPaso = computed<'vencido' | 'hoy' | 'proximo' | null>(() => {
  if (!props.actividad.proximoPaso) return null
  if (!props.actividad.proximoPasoFecha) return 'proximo'
  if (props.actividad.proximoPasoFecha < hoy) return 'vencido'
  if (props.actividad.proximoPasoFecha === hoy) return 'hoy'
  return 'proximo'
})
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 hover:shadow-md transition-all group">
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
          <span class="w-px h-5 bg-slate-200 shrink-0" />
          <button @click="emit('editar')"
            class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-colors shrink-0"
            title="Editar actividad">
            <Pencil :size="14" />
          </button>
          <button @click="emit('eliminar')"
            class="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-slate-500 flex items-center justify-center transition-colors shrink-0"
            title="Eliminar actividad">
            <Trash2 :size="15" />
          </button>
        </div>
      </div>

      <p class="text-[12px] text-slate-700 mb-2">{{ actividad.accion }}</p>

      <div v-if="oportunidad" class="flex items-center gap-1.5 mb-2">
        <Target :size="11" class="text-[#2447F9] flex-shrink-0" />
        <span class="text-[11px] text-[#2447F9] font-semibold">{{ oportunidad.servicio }}</span>
        <span class="text-[10px] text-slate-400">· {{ clienteLabel(oportunidad) }}</span>
      </div>

      <div v-if="actividad.proximoPaso" class="flex items-center gap-2 rounded-lg px-3 py-2"
        :class="estadoProximoPaso === 'vencido' ? 'bg-red-50' : estadoProximoPaso === 'hoy' ? 'bg-amber-50' : 'bg-[#F8FAFC]'">
        <AlarmClock v-if="estadoProximoPaso === 'vencido' || estadoProximoPaso === 'hoy'" :size="12"
          :class="estadoProximoPaso === 'vencido' ? 'text-red-500' : 'text-amber-500'" class="flex-shrink-0" />
        <span class="text-[9px] font-bold uppercase tracking-wide flex-shrink-0"
          :class="estadoProximoPaso === 'vencido' ? 'text-red-500' : estadoProximoPaso === 'hoy' ? 'text-amber-600' : 'text-slate-400'">Próx. paso:</span>
        <span class="text-[11px] font-medium" :class="estadoProximoPaso === 'vencido' ? 'text-red-600' : estadoProximoPaso === 'hoy' ? 'text-amber-700' : 'text-[#2447F9]'">{{ actividad.proximoPaso }}</span>
        <span v-if="actividad.proximoPasoFecha" class="text-[10px] text-slate-400 ml-auto flex-shrink-0">
          {{ estadoProximoPaso === 'vencido' ? 'Venció' : 'Para' }} {{ actividad.proximoPasoFecha }}
        </span>
      </div>
    </div>
  </div>
</template>
