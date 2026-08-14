<script setup lang="ts">
import { ref } from 'vue'
import { X, AlertCircle } from 'lucide-vue-next'
import type { PlanDraft } from '../services/servicios.api'
import PlanForm from '../forms/PlanForm.vue'

defineProps<{ categoriaFija?: string; error?: string | null }>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<PlanDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof PlanForm>>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-default surface-header">
        <div>
          <h3 class="text-[14px] font-bold text-heading">{{ categoriaFija ? `Nuevo plan en "${categoriaFija}"` : 'Nuevo servicio' }}</h3>
          <p class="text-[11px] text-muted mt-0.5">Se guarda directo en el catálogo Plan Liga del portal</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>
      <div class="overflow-y-auto flex-1 p-6">
        <div v-if="error" class="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 dark:text-red-400 shrink-0" />
          <p class="text-[11px] text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
        </div>
        <PlanForm ref="formRef" v-model="draft" :categoria-fija="categoriaFija" @valid-submit="emit('submit')" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-default surface-header">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border-default surface-card text-[11px] font-semibold text-body surface-hover transition-all">Cancelar</button>
        <button @click="formRef?.submit()" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          {{ categoriaFija ? 'Crear plan' : 'Crear servicio' }}
        </button>
      </div>
    </div>
  </div>
</template>
