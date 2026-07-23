<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ToggleRight, Loader2 } from 'lucide-vue-next'
import { fechaIngresoMinima, fechaIngresoMaxima } from '../constants/plan-liga.constants'
import CalendarioFechaIngreso from '../components/CalendarioFechaIngreso.vue'

const props = defineProps<{
  titulo: string
  nombre?: string
  guardando?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  confirmar: [fechaIngreso: string]
  cancelar: []
}>()

const visible = defineModel<boolean>('visible', { required: true })

const minFecha = fechaIngresoMinima()
const maxFecha = fechaIngresoMaxima()
const fechaIngreso = ref(maxFecha)

watch(visible, (v) => {
  if (v) fechaIngreso.value = maxFecha
})

const cerrar = () => {
  visible.value = false
  emit('cancelar')
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="cerrar">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC] rounded-t-2xl">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><ToggleRight :size="15" class="text-emerald-600" />{{ props.titulo }}</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">{{ props.nombre }}</p>
        </div>
        <button @click="cerrar" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de ingreso</label>
          <CalendarioFechaIngreso v-model="fechaIngreso" :min="minFecha" :max="maxFecha" />
          <p class="text-[10px] text-slate-400 mt-1">Debe estar entre {{ minFecha }} y {{ maxFecha }}.</p>
        </div>
        <p v-if="props.error" class="text-[11px] text-red-600 font-medium">{{ props.error }}</p>
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC] rounded-b-2xl">
        <button @click="cerrar" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="emit('confirmar', fechaIngreso)" :disabled="props.guardando || !fechaIngreso"
          class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="props.guardando" :size="12" class="animate-spin" />
          Activar
        </button>
      </div>
    </div>
  </div>
</template>
