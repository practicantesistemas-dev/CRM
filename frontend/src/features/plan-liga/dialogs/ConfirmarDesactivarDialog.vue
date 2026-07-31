<script setup lang="ts">
import { ToggleLeft, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  titulo: string
  nombre?: string
  guardando?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  confirmar: []
  cancelar: []
}>()

const visible = defineModel<boolean>('visible', { required: true })

const cerrar = () => {
  visible.value = false
  emit('cancelar')
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="cerrar">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div class="p-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <ToggleLeft :size="20" class="text-red-500" />
        </div>
        <h3 class="text-[14px] font-bold text-[#0F172A] mb-1">{{ props.titulo }}</h3>
        <p class="text-[12px] text-slate-500">¿Confirma que desea desactivar a <strong>{{ props.nombre }}</strong>?</p>
        <p v-if="props.error" class="text-[11px] text-red-600 font-medium mt-2">{{ props.error }}</p>
      </div>
      <div class="flex gap-2 px-6 pb-6">
        <button @click="cerrar" class="flex-1 h-9 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          Cancelar
        </button>
        <button @click="emit('confirmar')" :disabled="props.guardando"
          class="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-lg bg-red-500 text-white text-[11px] font-bold shadow hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="props.guardando" :size="12" class="animate-spin" />
          Desactivar
        </button>
      </div>
    </div>
  </div>
</template>
