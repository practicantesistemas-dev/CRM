<script setup lang="ts">
import { AlertTriangle, Play, Pause, Edit2, Trash2, Zap, Clock } from 'lucide-vue-next'
import type { Automatizacion } from '../types/automatizacion'
import { TRIGGER_META, ACCION_META, ESTADO_STYLE, formatDate } from '../constants/automatizaciones.constants'

defineProps<{ automatizacion: Automatizacion }>()
const emit = defineEmits<{
  'toggle-activo': []
  editar: []
  eliminar: []
}>()
</script>

<template>
  <div
    class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md group"
    :class="automatizacion.estado === 'Error' ? 'border-red-200' : 'border-slate-200'"
  >
    <div v-if="automatizacion.estado === 'Error'" class="flex items-center gap-2 px-5 py-2 bg-red-50 border-b border-red-200">
      <AlertTriangle :size="12" class="text-red-500 shrink-0" />
      <p class="text-[11px] text-red-600 font-medium">
        Esta automatización tiene errores y se ha detenido. Revisa la configuración.
      </p>
    </div>

    <div class="flex items-start gap-4 p-5">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        :style="{ backgroundColor: TRIGGER_META[automatizacion.trigger].bg }"
      >
        <component :is="TRIGGER_META[automatizacion.trigger].icono" :size="17" :style="{ color: TRIGGER_META[automatizacion.trigger].color }" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-[13px] font-bold text-[#0F172A] truncate">{{ automatizacion.nombre }}</h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="ESTADO_STYLE[automatizacion.estado]">
                {{ automatizacion.estado }}
              </span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{{ automatizacion.descripcion }}</p>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="emit('toggle-activo')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              :class="automatizacion.activo
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'"
              :title="automatizacion.activo ? 'Pausar' : 'Activar'"
            >
              <component :is="automatizacion.activo ? Pause : Play" :size="13" />
            </button>
            <button
              @click="emit('editar')"
              class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-[#EEF2FF] hover:text-[#2447F9] text-slate-500 flex items-center justify-center transition-all"
              title="Editar"
            >
              <Edit2 :size="12" />
            </button>
            <button
              @click="emit('eliminar')"
              class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 flex items-center justify-center transition-all"
              title="Eliminar"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-3 flex-wrap">
          <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <component :is="TRIGGER_META[automatizacion.trigger].icono" :size="11" :style="{ color: TRIGGER_META[automatizacion.trigger].color }" />
            <span class="text-[10px] font-semibold text-slate-600">{{ automatizacion.trigger }}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-bold">→</div>
          <div class="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <component :is="ACCION_META[automatizacion.accion].icono" :size="11" :style="{ color: ACCION_META[automatizacion.accion].color }" />
            <span class="text-[10px] font-semibold text-slate-600">{{ automatizacion.accion }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-3 flex-wrap">
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Zap :size="10" class="text-[#C9A227]" />
            <span><strong class="text-slate-600">{{ automatizacion.ejecuciones }}</strong> ejecuciones</span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Clock :size="10" />
            <span>Última: <strong class="text-slate-600">{{ formatDate(automatizacion.ultimaEjecucion) }}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Creado por <strong class="text-slate-600">{{ automatizacion.creadoPor }}</strong> el {{ automatizacion.creadoEn }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
