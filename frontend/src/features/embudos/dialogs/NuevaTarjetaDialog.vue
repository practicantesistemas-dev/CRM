<script setup lang="ts">
import type { TarjetaDraft } from '../types/tarjeta'
import TarjetaForm from '../forms/TarjetaForm.vue'

defineProps<{ etapa: string }>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<TarjetaDraft>('draft', { required: true })
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    @click.self="visible = false"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">Nueva Tarjeta</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Etapa: <strong>{{ etapa }}</strong></p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="p-6">
        <TarjetaForm v-model="draft" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="emit('submit')" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Crear tarjeta</button>
      </div>
    </div>
  </div>
</template>
