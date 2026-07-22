<script setup lang="ts">
import { X, Users, AlertCircle, Plus, Loader2 } from 'lucide-vue-next'
import type { Beneficiario, Titular } from '../types/plan-liga'
import CuposIndicador from '../components/CuposIndicador.vue'
import BeneficiarioItem from '../components/BeneficiarioItem.vue'

defineProps<{
  titular: Titular | null
  beneficiarios: Beneficiario[]
  activosActual: number
  cupoMaximo: number
  puedeAgregar: boolean
  cargando?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  editar: [b: Beneficiario]
  activar: [b: Beneficiario]
  desactivar: [b: Beneficiario]
  reemplazar: [b: Beneficiario]
  'agregar-nuevo': []
}>()

const visible = defineModel<boolean>('visible', { required: true })
const errLimite = defineModel<boolean>('errLimite', { required: true })
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999]" @click.self="visible = false">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="visible = false" />
    <div class="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col z-10">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAFC] shrink-0">
        <div>
          <h3 class="text-[13px] font-bold text-[#0F172A] flex items-center gap-2"><Users :size="15" class="text-[#EC4899]" />Beneficiarios</h3>
          <p class="text-[11px] text-slate-500 mt-0.5">{{ titular?.nombre }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="px-5 py-3 border-b border-slate-100 shrink-0">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Cupos utilizados</span>
          <span class="text-[12px] font-bold" :class="activosActual >= cupoMaximo ? 'text-[#EC4899]' : 'text-[#059669]'">{{ activosActual }} / {{ cupoMaximo }} activos</span>
        </div>
        <CuposIndicador :activos="activosActual" :max="cupoMaximo" variant="bar" />
        <div v-if="errLimite" class="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 shrink-0" />
          <p class="text-[11px] text-red-600 font-medium">El titular ya cuenta con el máximo permitido de <strong>{{ cupoMaximo }} beneficiarios activos</strong>.</p>
          <button @click="errLimite = false" class="ml-auto text-red-400 hover:text-red-600 shrink-0"><X :size="11" /></button>
        </div>
        <div v-if="error" class="mt-2 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 shrink-0" />
          <p class="text-[11px] text-red-600 font-medium">{{ error }}</p>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <div v-if="cargando" class="flex items-center justify-center py-10 text-slate-400 text-[12px] gap-2">
          <Loader2 :size="16" class="animate-spin" />Cargando beneficiarios...
        </div>
        <template v-else>
          <BeneficiarioItem
            v-for="b in beneficiarios"
            :key="b.id"
            :beneficiario="b"
            @editar="emit('editar', b)"
            @activar="emit('activar', b)"
            @desactivar="emit('desactivar', b)"
            @reemplazar="emit('reemplazar', b)"
          />
          <div v-if="beneficiarios.length === 0" class="text-center py-10 text-slate-400 text-[12px]">
            <Users :size="28" class="text-slate-300 mx-auto mb-2" />No hay beneficiarios registrados.
          </div>
        </template>
      </div>
      <div class="px-4 py-4 border-t border-slate-200 shrink-0">
        <button @click="emit('agregar-nuevo')" :disabled="!puedeAgregar"
          class="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-[12px] font-bold shadow transition-all"
          :class="puedeAgregar ? 'bg-[#EC4899] text-white hover:bg-[#D61F69]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
          <Plus :size="14" />
          <span v-if="puedeAgregar">Agregar beneficiario ({{ activosActual }}/{{ cupoMaximo }})</span>
          <span v-else>Límite alcanzado ({{ cupoMaximo }}/{{ cupoMaximo }})</span>
        </button>
      </div>
    </div>
  </div>
</template>
