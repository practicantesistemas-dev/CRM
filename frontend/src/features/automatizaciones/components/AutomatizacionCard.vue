<script setup lang="ts">
import { AlertTriangle, Play, Pause, Edit2, Trash2, Zap, Clock } from 'lucide-vue-next'
import type { Automatizacion } from '../types/automatizacion'
import { ACCION_META, ESTADO_STYLE, formatDate } from '../constants/automatizaciones.constants'

defineProps<{ automatizacion: Automatizacion }>()
const emit = defineEmits<{
  'toggle-activo': []
  editar: []
  eliminar: []
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md group"
    :class="automatizacion.estado === 'Error' ? 'border-red-200 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'"
  >
    <div v-if="automatizacion.estado === 'Error'" class="flex items-center gap-2 px-5 py-2 bg-red-50 dark:bg-red-950/40 border-b border-red-200 dark:border-red-800">
      <AlertTriangle :size="12" class="text-red-500 dark:text-red-400 shrink-0" />
      <p class="text-[11px] text-red-600 dark:text-red-400 font-medium">
        Esta automatización tiene errores y se ha detenido. Revisa la configuración.
      </p>
    </div>

    <div class="flex items-start gap-4 p-5">
      <div
        class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        :style="{ backgroundColor: '#EEF2FF' }"
      >
        <component :is="ACCION_META[automatizacion.accion].icono" :size="17" :style="{ color: ACCION_META[automatizacion.accion].color }" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3 flex-wrap">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-[13px] font-bold text-heading truncate">{{ automatizacion.nombre }}</h3>
              <span class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="ESTADO_STYLE[automatizacion.estado]">
                {{ automatizacion.estado }}
              </span>
            </div>
            <p class="text-[11px] text-body mt-0.5 line-clamp-1">{{ automatizacion.descripcion }}</p>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <button
              @click="emit('toggle-activo')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              :class="automatizacion.activo
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'"
              :title="automatizacion.activo ? 'Pausar' : 'Activar'"
            >
              <component :is="automatizacion.activo ? Pause : Play" :size="13" />
            </button>
            <button
              @click="emit('editar')"
              class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-[#EEF2FF] dark:hover:bg-blue-950/40 hover:text-[#2447F9] dark:hover:text-blue-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all"
              title="Editar"
            >
              <Edit2 :size="12" />
            </button>
            <button
              @click="emit('eliminar')"
              class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-400 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-all"
              title="Eliminar"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-3 flex-wrap">
          <div class="flex items-center gap-1.5 surface-sunken border border-default rounded-lg px-2.5 py-1">
            <component :is="ACCION_META[automatizacion.accion].icono" :size="11" :style="{ color: ACCION_META[automatizacion.accion].color }" />
            <span class="text-[10px] font-semibold text-body">{{ automatizacion.accion }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 mt-3 flex-wrap">
          <div class="flex items-center gap-1.5 text-[10px] text-muted">
            <Zap :size="10" class="text-[#C9A227]" />
            <span><strong class="text-body">{{ automatizacion.ejecuciones }}</strong> ejecuciones</span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-muted">
            <Clock :size="10" />
            <span>Última: <strong class="text-body">{{ formatDate(automatizacion.ultimaEjecucion) }}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-muted">
            <span>Creado por <strong class="text-body">{{ automatizacion.creadoPor }}</strong> el {{ automatizacion.creadoEn }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
