<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  visible: boolean
  titulo: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
  peligro?: boolean
  cargando?: boolean
}>(), {
  textoConfirmar: 'Confirmar',
  textoCancelar: 'Cancelar',
  peligro: false,
  cargando: false,
})

const emit = defineEmits<{ confirmar: []; cancelar: [] }>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="emit('cancelar')">
    <div class="surface-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div class="p-5 flex gap-3">
        <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0" :class="props.peligro ? 'bg-red-50 dark:bg-red-950/40' : 'bg-[#EEF2FF] dark:bg-blue-950/40'">
          <AlertTriangle :size="16" :class="props.peligro ? 'text-red-500' : 'text-[#2447F9]'" />
        </div>
        <div class="min-w-0">
          <h3 class="text-[13px] font-bold text-heading">{{ titulo }}</h3>
          <p class="text-[12px] text-muted mt-1 leading-relaxed">{{ mensaje }}</p>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-default surface-header">
        <button
          @click="emit('cancelar')"
          :disabled="cargando"
          class="h-9 px-5 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
        >{{ textoCancelar }}</button>
        <button
          @click="emit('confirmar')"
          :disabled="cargando"
          class="h-9 px-5 rounded-lg text-[11px] font-bold shadow transition-all disabled:opacity-50"
          :class="props.peligro ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#2447F9] hover:bg-[#1D3DD9] text-white'"
        >{{ cargando ? 'Un momento…' : textoConfirmar }}</button>
      </div>
    </div>
  </div>
</template>
