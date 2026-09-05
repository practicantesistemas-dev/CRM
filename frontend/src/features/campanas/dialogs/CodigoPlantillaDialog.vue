<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Copy, Check, Wand2 } from 'lucide-vue-next'

const props = defineProps<{ html: string }>()
const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ aplicar: [string] }>()

const buf = ref('')
const copiado = ref(false)

watch(visible, (v) => {
  if (v) { buf.value = props.html; copiado.value = false }
})

async function copiar() {
  try {
    await navigator.clipboard.writeText(buf.value)
    copiado.value = true
    setTimeout(() => { copiado.value = false }, 1500)
  } catch { /* clipboard bloqueado */ }
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="surface-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-default surface-header">
        <div>
          <h3 class="text-[14px] font-bold text-heading">Código de la plantilla</h3>
          <p class="text-[11px] text-muted mt-0.5">Un solo archivo HTML con los estilos embebidos. Edítalo y aplícalo al editor.</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>

      <div class="flex items-center justify-end px-5 pt-3">
        <button
          @click="copiar"
          class="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <component :is="copiado ? Check : Copy" :size="12" />
          {{ copiado ? 'Copiado' : 'Copiar todo' }}
        </button>
      </div>

      <div class="flex-1 min-h-0 p-5 pt-3">
        <textarea
          v-model="buf"
          spellcheck="false"
          class="w-full h-full min-h-[48vh] px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] font-mono leading-relaxed outline-none focus:border-[#2447F9] resize-none"
        />
      </div>

      <div class="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-default surface-header">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
        <button @click="emit('aplicar', buf)" class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Wand2 :size="13" /> Aplicar al editor
        </button>
      </div>
    </div>
  </div>
</template>
