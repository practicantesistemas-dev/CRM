<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { CampanaDraft } from '../types/campana'
import CampanaForm from '../forms/CampanaForm.vue'

const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<CampanaDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof CampanaForm>>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="surface-card rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-default surface-header">
        <div>
          <h3 class="text-[14px] font-bold text-heading">Nueva Campaña</h3>
          <p class="text-[11px] text-muted mt-0.5">Envío masivo por segmento</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>
      <div class="p-6 space-y-4">
        <CampanaForm ref="formRef" v-model="draft" @valid-submit="emit('submit')" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-default surface-header">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
        <button @click="formRef?.submit()" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Crear campaña</button>
      </div>
    </div>
  </div>
</template>
