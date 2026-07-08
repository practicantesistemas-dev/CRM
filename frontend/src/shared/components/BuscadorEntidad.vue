<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, X } from 'lucide-vue-next'

export interface OpcionBuscador {
  id: number
  label: string
  sublabel?: string
}

const props = defineProps<{
  opciones: OpcionBuscador[]
  placeholder?: string
  vacio?: string
  disabled?: boolean
}>()
const emit = defineEmits<{ blur: []; select: [item: OpcionBuscador | null] }>()

const modelValue = defineModel<number | null>({ required: true })

const abierto = ref(false)
const query = ref('')

const seleccionado = computed(() => props.opciones.find(o => o.id === modelValue.value) ?? null)

const filtradas = computed(() => {
  const q = query.value.trim().toLowerCase()
  const base = !q
    ? props.opciones
    : props.opciones.filter(o => o.label.toLowerCase().includes(q) || o.sublabel?.toLowerCase().includes(q))
  return base.slice(0, 8)
})

function elegir(o: OpcionBuscador) {
  modelValue.value = o.id
  query.value = ''
  abierto.value = false
  emit('select', o)
}

function limpiar() {
  modelValue.value = null
  query.value = ''
  emit('select', null)
}

function alEnfocar() {
  if (props.disabled) return
  abierto.value = true
  query.value = ''
}

function alPerderFoco() {
  setTimeout(() => { abierto.value = false; emit('blur') }, 150)
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <Search :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        :value="abierto ? query : (seleccionado?.label ?? '')"
        @input="query = ($event.target as HTMLInputElement).value; abierto = true"
        @focus="alEnfocar"
        @blur="alPerderFoco"
        :disabled="disabled"
        :placeholder="placeholder ?? 'Buscar...'"
        class="w-full h-10 pl-8 pr-8 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all border-slate-200 focus:border-[#2447F9] disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        v-if="seleccionado && !disabled"
        type="button"
        @mousedown.prevent="limpiar"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        <X :size="13" />
      </button>
    </div>
    <div v-if="abierto" class="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg py-1">
      <button
        v-for="o in filtradas" :key="o.id" type="button"
        @mousedown.prevent="elegir(o)"
        class="w-full text-left px-3 py-2 text-[12px] hover:bg-[#EEF2FF] transition-colors"
      >
        <div class="font-semibold text-[#0F172A]">{{ o.label }}</div>
        <div v-if="o.sublabel" class="text-[10px] text-slate-400">{{ o.sublabel }}</div>
      </button>
      <div v-if="filtradas.length === 0" class="px-3 py-2 text-[11px] text-slate-400">{{ vacio ?? 'Sin resultados' }}</div>
    </div>
  </div>
</template>
