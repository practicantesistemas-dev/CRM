<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, ToggleRight, Loader2 } from 'lucide-vue-next'
import DatePicker from 'primevue/datepicker'
import { fechaIngresoMaxima } from '../constants/plan-liga.constants'

const props = defineProps<{
  titulo: string
  nombre?: string
  guardando?: boolean
  error?: string | null
  // El beneficiario hereda la fecha de ingreso del titular, así que no se le pide;
  // el titular sí la elige porque no hay de dónde heredarla.
  pedirFecha?: boolean
}>()

const emit = defineEmits<{
  confirmar: [fechaIngreso: string, aplicarAGrupo: boolean]
  cancelar: []
}>()

const visible = defineModel<boolean>('visible', { required: true })

// El DatePicker trabaja con Date; el resto de la app maneja la fecha como string 'YYYY-MM-DD'.
const formatFechaLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const hoy = new Date()
const dosMesesAtras = new Date()
dosMesesAtras.setMonth(dosMesesAtras.getMonth() - 2)
const fechaIngresoDate = ref<Date>(hoy)
// Desmarcado por defecto: hay que elegirlo a propósito para aplicar la fecha
// también a los beneficiarios de este titular.
const aplicarAGrupo = ref(false)
watch(visible, (v) => { if (v) { fechaIngresoDate.value = new Date(); aplicarAGrupo.value = false } })

const cerrar = () => {
  visible.value = false
  emit('cancelar')
}

const confirmar = () => emit(
  'confirmar',
  props.pedirFecha ? formatFechaLocal(fechaIngresoDate.value) : fechaIngresoMaxima(),
  aplicarAGrupo.value,
)
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 rounded-t-2xl">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-2"><ToggleRight :size="15" class="text-emerald-600 dark:text-emerald-400" />{{ props.titulo }}</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{{ props.nombre }}</p>
        </div>
        <button @click="cerrar" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>
      <div class="p-6 space-y-4">
        <p class="text-[12px] text-slate-500 dark:text-slate-400">¿Confirma que desea activar a {{ props.nombre }}?</p>
        <div v-if="props.pedirFecha">
          <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Fecha de ingreso *</label>
          <DatePicker
            v-model="fechaIngresoDate"
            :min-date="dosMesesAtras"
            date-format="dd/mm/yy"
            show-icon
            icon-display="input"
            fluid
            placeholder="Selecciona una fecha"
            input-class="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-[12px] font-medium text-slate-700 dark:text-slate-100 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 dark:focus:ring-emerald-900/40 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          <label class="flex items-center gap-2 mt-3 cursor-pointer select-none">
            <input type="checkbox" v-model="aplicarAGrupo" class="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500" />
            <span class="text-[11px] text-slate-600 dark:text-slate-300">Aplicar esta fecha también a los beneficiarios de este titular</span>
          </label>
        </div>
        <p v-if="props.error" class="text-[11px] text-red-600 dark:text-red-400 font-medium">{{ props.error }}</p>
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900 rounded-b-2xl">
        <button @click="cerrar" class="h-9 px-5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
        <button @click="confirmar" :disabled="props.guardando"
          class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-emerald-600 text-white text-[11px] font-bold shadow hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="props.guardando" :size="12" class="animate-spin" />
          {{ props.guardando ? (props.pedirFecha ? 'Activando...' : 'Enviando notificación por correo...') : 'Activar' }}
        </button>
      </div>
    </div>
  </div>
</template>
