<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import type { Automatizacion } from '../types/automatizacion'

defineProps<{ automatizacion: Automatizacion | null }>()
const emit = defineEmits<{ confirmar: []; cancelar: [] }>()
</script>

<template>
  <div
    v-if="automatizacion"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    @click.self="emit('cancelar')"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div class="p-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 :size="20" class="text-red-500" />
        </div>
        <h3 class="text-[14px] font-bold text-[#0F172A] mb-1">Eliminar automatización</h3>
        <p class="text-[12px] text-slate-500">
          ¿Eliminar <strong>"{{ automatizacion.nombre }}"</strong>? Esta acción no se puede deshacer.
        </p>
      </div>
      <div class="flex gap-2 px-6 pb-6">
        <button
          @click="emit('cancelar')"
          class="flex-1 h-9 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          Cancelar
        </button>
        <button
          @click="emit('confirmar')"
          class="flex-1 h-9 rounded-lg bg-red-500 text-white text-[11px] font-bold shadow hover:bg-red-600 transition-all"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
