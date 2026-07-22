<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  min: string
  max: string
}>()

const fecha = defineModel<string>({ required: true })

const DIAS_SEMANA = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function fromISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function toISO(date: Date): string {
  return date.toISOString().split('T')[0]
}
function formatDisplay(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const abierto = ref(false)
const raiz = ref<HTMLElement | null>(null)

const mesMin = computed(() => { const d = fromISO(props.min); return d.getUTCFullYear() * 12 + d.getUTCMonth() })
const mesMax = computed(() => { const d = fromISO(props.max); return d.getUTCFullYear() * 12 + d.getUTCMonth() })

const inicial = fromISO(fecha.value || props.max)
const anioVisible = ref(inicial.getUTCFullYear())
const mesVisible = ref(inicial.getUTCMonth())
const claveMesVisible = computed(() => anioVisible.value * 12 + mesVisible.value)

const puedeAnterior = computed(() => claveMesVisible.value > mesMin.value)
const puedeSiguiente = computed(() => claveMesVisible.value < mesMax.value)

const irMesAnterior = () => {
  if (!puedeAnterior.value) return
  if (mesVisible.value === 0) { mesVisible.value = 11; anioVisible.value -= 1 } else { mesVisible.value -= 1 }
}
const irMesSiguiente = () => {
  if (!puedeSiguiente.value) return
  if (mesVisible.value === 11) { mesVisible.value = 0; anioVisible.value += 1 } else { mesVisible.value += 1 }
}

interface Celda { iso: string; dia: number; deshabilitado: boolean }

const celdas = computed<(Celda | null)[]>(() => {
  const primerDia = new Date(Date.UTC(anioVisible.value, mesVisible.value, 1))
  const offset = (primerDia.getUTCDay() + 6) % 7 // lunes = 0
  const diasEnMes = new Date(Date.UTC(anioVisible.value, mesVisible.value + 1, 0)).getUTCDate()

  const out: (Celda | null)[] = []
  for (let i = 0; i < offset; i++) out.push(null)
  for (let dia = 1; dia <= diasEnMes; dia++) {
    const iso = toISO(new Date(Date.UTC(anioVisible.value, mesVisible.value, dia)))
    out.push({ iso, dia, deshabilitado: iso < props.min || iso > props.max })
  }
  return out
})

const seleccionar = (c: Celda) => {
  if (c.deshabilitado) return
  fecha.value = c.iso
  abierto.value = false
}

const alHacerClicAfuera = (e: MouseEvent) => {
  if (raiz.value && !raiz.value.contains(e.target as Node)) abierto.value = false
}
onMounted(() => document.addEventListener('click', alHacerClicAfuera))
onUnmounted(() => document.removeEventListener('click', alHacerClicAfuera))
</script>

<template>
  <div ref="raiz" class="relative">
    <button
      type="button"
      @click="abierto = !abierto"
      class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-emerald-500 transition-all flex items-center justify-between text-left"
      :class="abierto ? 'border-emerald-500 bg-white' : ''"
    >
      <span :class="fecha ? 'text-[#0F172A]' : 'text-slate-400'">{{ formatDisplay(fecha) || 'Selecciona una fecha' }}</span>
      <Calendar :size="14" class="text-slate-400 shrink-0" />
    </button>

    <div
      v-if="abierto"
      class="absolute z-20 mt-1.5 w-full min-w-[260px] bg-white rounded-xl border border-slate-200 shadow-lg p-3"
    >
      <div class="flex items-center justify-between mb-2">
        <button type="button" @click="irMesAnterior" :disabled="!puedeAnterior"
          class="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronLeft :size="13" />
        </button>
        <span class="text-[11px] font-bold text-[#0F172A] capitalize">{{ MESES[mesVisible] }} {{ anioVisible }}</span>
        <button type="button" @click="irMesSiguiente" :disabled="!puedeSiguiente"
          class="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ChevronRight :size="13" />
        </button>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-1">
        <span v-for="d in DIAS_SEMANA" :key="d" class="text-[9px] font-bold text-slate-400 uppercase text-center py-1">{{ d }}</span>
      </div>
      <div class="grid grid-cols-7 gap-1">
        <template v-for="(c, i) in celdas" :key="i">
          <span v-if="!c" />
          <button
            v-else
            type="button"
            @click="seleccionar(c)"
            :disabled="c.deshabilitado"
            class="h-7 rounded-md text-[11px] font-medium transition-all"
            :class="c.deshabilitado
              ? 'text-slate-300 cursor-not-allowed'
              : c.iso === fecha
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'"
          >
            {{ c.dia }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>
