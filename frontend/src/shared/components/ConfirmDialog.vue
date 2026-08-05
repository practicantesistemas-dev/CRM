<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'

withDefaults(defineProps<{
  titulo?: string
  mensaje: string
  textoConfirmar?: string
  textoCancelar?: string
}>(), {
  titulo: 'Confirmar acción',
  textoConfirmar: 'Eliminar',
  textoCancelar: 'Cancelar',
})

const emit = defineEmits<{ confirmar: [] }>()
const visible = defineModel<boolean>('visible', { required: true })

const confirmar = () => {
  visible.value = false
  emit('confirmar')
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div class="p-6 flex flex-col items-center text-center gap-3">
        <div class="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <AlertTriangle :size="20" class="text-red-500" />
        </div>
        <h3 class="text-[14px] font-bold text-[#0F172A]">{{ titulo }}</h3>
        <p class="text-[12px] text-slate-500 leading-relaxed">{{ mensaje }}</p>
      </div>
      <div class="flex items-center gap-2 px-6 pb-6">
        <button
          @click="visible = false"
          class="flex-1 h-9 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >{{ textoCancelar }}</button>
        <button
          @click="confirmar"
          class="flex-1 h-9 rounded-lg bg-red-600 text-white text-[11px] font-bold shadow hover:bg-red-700 transition-all"
        >{{ textoConfirmar }}</button>
      </div>
    </div>
  </div>
</template>
