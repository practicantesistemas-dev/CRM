<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { AlarmClock, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Loader2 } from 'lucide-vue-next'
import type { Actividad } from '../types/actividad'

const props = defineProps<{ pendientes: Actividad[]; completando?: number | null }>()
const emit = defineEmits<{ abrir: [Actividad]; completar: [Actividad] }>()

const abierto = ref(true)

const PAGE_SIZE = 3
const paginaActual = ref(1)
const totalPaginas = computed(() => Math.ceil(props.pendientes.length / PAGE_SIZE))
const pendientesPaginados = computed(() => {
  const start = (paginaActual.value - 1) * PAGE_SIZE
  return props.pendientes.slice(start, start + PAGE_SIZE)
})
// Si se completa/borra un pendiente y la página actual queda vacía (o la lista cambia de
// tamaño), no se deja "colgada" en una página que ya no existe.
watch(() => props.pendientes.length, () => {
  if (paginaActual.value > totalPaginas.value) paginaActual.value = Math.max(1, totalPaginas.value)
})

const hoy = new Date().toISOString().split('T')[0]
const estadoDe = (a: Actividad): 'vencido' | 'hoy' | 'proximo' => {
  if (!a.proximoPasoFecha) return 'proximo'
  if (a.proximoPasoFecha < hoy) return 'vencido'
  if (a.proximoPasoFecha === hoy) return 'hoy'
  return 'proximo'
}
const sujetoDe = (a: Actividad) => [a.contactoNombre, a.empresaNombre, a.titularNombre].filter(Boolean)[0] ?? 'Sin asociar'

const vencidos = computed(() => props.pendientes.filter(a => estadoDe(a) === 'vencido').length)
</script>

<template>
  <div v-if="pendientes.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-sm overflow-hidden">
    <button @click="abierto = !abierto" class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center flex-shrink-0">
          <AlarmClock :size="15" class="text-amber-600 dark:text-amber-400" />
        </div>
        <div class="text-left">
          <p class="text-[12px] font-bold text-heading">Pendientes por seguimiento</p>
          <p class="text-[10px] text-subtle">
            {{ pendientes.length }} próximo{{ pendientes.length === 1 ? ' paso' : 's pasos' }}
            <span v-if="vencidos > 0" class="text-red-600 dark:text-red-400 font-semibold"> · {{ vencidos }} vencido{{ vencidos === 1 ? '' : 's' }}</span>
          </p>
        </div>
      </div>
      <component :is="abierto ? ChevronUp : ChevronDown" :size="15" class="text-slate-400 dark:text-slate-500 flex-shrink-0" />
    </button>

    <div v-if="abierto" class="divide-y divide-slate-100 dark:divide-slate-700">
      <div v-for="a in pendientesPaginados" :key="a.id"
        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
        <button type="button" title="Marcar como realizado" :disabled="completando === a.id"
          @click="emit('completar', a)"
          class="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0 text-transparent hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors disabled:opacity-50">
          <Loader2 v-if="completando === a.id" :size="11" class="animate-spin text-slate-400 dark:text-slate-500" />
          <Check v-else :size="11" />
        </button>
        <button type="button" @click="emit('abrir', a)" class="flex-1 min-w-0 flex items-center gap-3 text-left">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="estadoDe(a) === 'vencido' ? 'bg-red-500' : estadoDe(a) === 'hoy' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'" />
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-semibold text-heading truncate">{{ a.proximoPaso }}</p>
            <p class="text-[10px] text-muted truncate">{{ sujetoDe(a) }}</p>
          </div>
          <span class="text-[10px] font-semibold flex-shrink-0"
            :class="estadoDe(a) === 'vencido' ? 'text-red-500 dark:text-red-400' : estadoDe(a) === 'hoy' ? 'text-amber-600 dark:text-amber-400' : 'text-muted'">
            {{ a.proximoPasoFecha ? (estadoDe(a) === 'vencido' ? 'Venció ' : 'Para ') + a.proximoPasoFecha : 'Registrada ' + a.fecha }}
          </span>
        </button>
      </div>
      <div v-if="totalPaginas > 1" class="flex items-center justify-center gap-3 px-1 py-2.5 border-t border-slate-100 dark:border-slate-700">
        <button @click="paginaActual -= 1" :disabled="paginaActual <= 1"
          class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Página anterior">
          <ChevronLeft :size="13" />
        </button>
        <span class="text-[10px] text-muted">Página <strong class="text-body">{{ paginaActual }}</strong> de <strong class="text-body">{{ totalPaginas }}</strong></span>
        <button @click="paginaActual += 1" :disabled="paginaActual >= totalPaginas"
          class="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Página siguiente">
          <ChevronRight :size="13" />
        </button>
      </div>
    </div>
  </div>
</template>
