<script setup lang="ts">
import { computed, ref } from 'vue'
import { AlarmClock, Check, ChevronDown, ChevronUp, Loader2 } from 'lucide-vue-next'
import type { Actividad } from '../types/actividad'

const props = defineProps<{ pendientes: Actividad[]; completando?: number | null }>()
const emit = defineEmits<{ abrir: [Actividad]; completar: [Actividad] }>()

const abierto = ref(true)

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
  <div v-if="pendientes.length > 0" class="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
    <button @click="abierto = !abierto" class="w-full flex items-center justify-between gap-3 px-4 py-3 bg-amber-50 hover:bg-amber-100/60 transition-colors">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlarmClock :size="15" class="text-amber-600" />
        </div>
        <div class="text-left">
          <p class="text-[12px] font-bold text-[#0F172A]">Pendientes por seguimiento</p>
          <p class="text-[10px] text-slate-500">
            {{ pendientes.length }} próximo{{ pendientes.length === 1 ? ' paso' : 's pasos' }}
            <span v-if="vencidos > 0" class="text-red-600 font-semibold"> · {{ vencidos }} vencido{{ vencidos === 1 ? '' : 's' }}</span>
          </p>
        </div>
      </div>
      <component :is="abierto ? ChevronUp : ChevronDown" :size="15" class="text-slate-400 flex-shrink-0" />
    </button>

    <div v-if="abierto" class="divide-y divide-slate-100 max-h-64 overflow-y-auto">
      <div v-for="a in pendientes" :key="a.id"
        class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
        <button type="button" title="Marcar como realizado" :disabled="completando === a.id"
          @click="emit('completar', a)"
          class="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center flex-shrink-0 text-transparent hover:text-emerald-600 hover:border-emerald-500 transition-colors disabled:opacity-50">
          <Loader2 v-if="completando === a.id" :size="11" class="animate-spin text-slate-400" />
          <Check v-else :size="11" />
        </button>
        <button type="button" @click="emit('abrir', a)" class="flex-1 min-w-0 flex items-center gap-3 text-left">
          <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
            :class="estadoDe(a) === 'vencido' ? 'bg-red-500' : estadoDe(a) === 'hoy' ? 'bg-amber-500' : 'bg-slate-300'" />
          <div class="flex-1 min-w-0">
            <p class="text-[11px] font-semibold text-[#0F172A] truncate">{{ a.proximoPaso }}</p>
            <p class="text-[10px] text-slate-400 truncate">{{ sujetoDe(a) }}</p>
          </div>
          <span class="text-[10px] font-semibold flex-shrink-0"
            :class="estadoDe(a) === 'vencido' ? 'text-red-500' : estadoDe(a) === 'hoy' ? 'text-amber-600' : 'text-slate-400'">
            {{ a.proximoPasoFecha ? (estadoDe(a) === 'vencido' ? 'Venció ' : 'Para ') + a.proximoPasoFecha : 'Registrada ' + a.fecha }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
