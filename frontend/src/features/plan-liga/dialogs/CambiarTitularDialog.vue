<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowLeftRight, Loader2, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  nombreActual?: string
  guardando?: boolean
  error?: string | null
}>()

const emit = defineEmits<{ confirmar: [documento: string] }>()

const visible = defineModel<boolean>('visible', { required: true })

const documento = ref('')
// Pide el documento primero; solo al confirmar en el segundo paso se dispara el cambio real.
const paso = ref<'formulario' | 'confirmar'>('formulario')
watch(visible, (v) => { if (v) { documento.value = ''; paso.value = 'formulario' } })

const cerrar = () => { visible.value = false }
const continuar = () => {
  if (!documento.value.trim()) return
  paso.value = 'confirmar'
}
const confirmar = () => emit('confirmar', documento.value.trim())
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="cerrar">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <template v-if="paso === 'formulario'">
        <div class="p-6 text-center">
          <div class="w-12 h-12 rounded-2xl bg-[#EEF2FF] dark:bg-blue-950/50 flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight :size="20" class="text-[#2447F9]" />
          </div>
          <h3 class="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 mb-1">Cambiar de titular</h3>
          <p class="text-[12px] text-slate-500 dark:text-slate-400">
            Mueve a <strong>{{ props.nombreActual }}</strong> a otro titular, conservando su registro (plan, historial, etc.).
          </p>
          <div class="text-left mt-4">
            <label class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Documento del nuevo titular</label>
            <input
              v-model="documento"
              type="text"
              placeholder="Número de documento"
              class="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:border-[#2447F9]"
              @keyup.enter="continuar"
            />
          </div>
        </div>
        <div class="flex gap-2 px-6 pb-6">
          <button @click="cerrar" class="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            Cancelar
          </button>
          <button @click="continuar" :disabled="!documento.trim()"
            class="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1E3AC9] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            Continuar
          </button>
        </div>
      </template>

      <template v-else>
        <div class="p-6 text-center">
          <div class="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle :size="20" class="text-amber-600 dark:text-amber-400" />
          </div>
          <h3 class="text-[14px] font-bold text-[#0F172A] dark:text-slate-100 mb-1">¿Confirmar el cambio?</h3>
          <p class="text-[12px] text-slate-500 dark:text-slate-400">
            Vas a mover a <strong>{{ props.nombreActual }}</strong> al titular con documento <strong>{{ documento }}</strong>.
            Esta acción no se puede deshacer.
          </p>
          <p v-if="props.error" class="text-[11px] text-red-600 dark:text-red-400 font-medium mt-3">{{ props.error }}</p>
        </div>
        <div class="flex gap-2 px-6 pb-6">
          <button @click="cerrar" :disabled="props.guardando" class="flex-1 h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            Cancelar
          </button>
          <button @click="confirmar" :disabled="props.guardando"
            class="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-lg bg-amber-600 text-white text-[11px] font-bold shadow hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            <Loader2 v-if="props.guardando" :size="12" class="animate-spin" />
            Sí, cambiar titular
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
