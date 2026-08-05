<script setup lang="ts">
import { ref } from 'vue'
import { X, Loader2, AlertCircle } from 'lucide-vue-next'
import type { ActividadServicioDraft } from '../types/actividadServicio'
import ActividadServicioForm from '../forms/ActividadServicioForm.vue'

defineProps<{
  modo: 'nuevo' | 'editar'
  guardando?: boolean
  error?: string | null
}>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<ActividadServicioDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof ActividadServicioForm>>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modo === 'nuevo' ? 'Nueva Actividad' : 'Editar Actividad' }}</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Actividad ofrecida por este proveedor</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="p-6">
        <div v-if="error" class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 shrink-0" />
          <p class="text-[11px] text-red-600 font-medium">{{ error }}</p>
        </div>
        <ActividadServicioForm ref="formRef" v-model="draft" @valid-submit="emit('submit')" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" :disabled="guardando" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all">Cancelar</button>
        <button @click="formRef?.submit()" :disabled="guardando"
          class="flex items-center justify-center gap-1.5 h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="guardando" :size="12" class="animate-spin" />
          {{ modo === 'nuevo' ? (guardando ? 'Creando...' : 'Crear actividad') : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>
