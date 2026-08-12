<script setup lang="ts">
import { Trash2, Loader2 } from 'lucide-vue-next'
import type { Actividad } from '../types/actividad'

defineProps<{ actividad: Actividad | null; eliminando?: boolean; error?: string | null }>()
const emit = defineEmits<{ confirmar: []; cancelar: [] }>()
</script>

<template>
  <div
    v-if="actividad"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    @click.self="emit('cancelar')"
  >
    <div class="surface-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
      <div class="p-6 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-4">
          <Trash2 :size="20" class="text-red-500 dark:text-red-400" />
        </div>
        <h3 class="text-[14px] font-bold text-heading mb-1">Eliminar actividad</h3>
        <p class="text-[12px] text-body">
          ¿Eliminar este registro de <strong>{{ actividad.tipo }}</strong>{{ actividad.contactoNombre || actividad.titularNombre || actividad.empresaNombre ? ` (${actividad.contactoNombre || actividad.titularNombre || actividad.empresaNombre})` : '' }}? Esta acción no se puede deshacer.
        </p>
        <p v-if="error" class="text-[11px] text-red-600 dark:text-red-400 font-medium mt-2">{{ error }}</p>
      </div>
      <div class="flex gap-2 px-6 pb-6">
        <button
          @click="emit('cancelar')"
          class="flex-1 h-9 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          Cancelar
        </button>
        <button
          @click="emit('confirmar')"
          :disabled="eliminando"
          class="flex items-center justify-center gap-1.5 flex-1 h-9 rounded-lg bg-red-500 text-white text-[11px] font-bold shadow hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          <Loader2 v-if="eliminando" :size="12" class="animate-spin" />
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
