<script setup lang="ts">
import { ref } from 'vue'
import { X, CheckCircle } from 'lucide-vue-next'
import type { BeneficiarioDraft } from '../types/plan-liga'
import BeneficiarioForm from '../forms/BeneficiarioForm.vue'

defineProps<{ modo: 'nuevo' | 'editar'; titularNombre?: string; cuposRestantes: number }>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<BeneficiarioDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof BeneficiarioForm>>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC] shrink-0">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modo === 'nuevo' ? 'Nuevo Beneficiario' : 'Editar Beneficiario' }}</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Titular: {{ titularNombre }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div v-if="modo === 'nuevo'" class="px-6 pt-4 flex items-center gap-2 bg-[#FCE7F3] border-b border-pink-200 shrink-0">
        <CheckCircle :size="14" class="text-[#EC4899] shrink-0" />
        <p class="text-[11px] text-[#EC4899] font-medium py-2">Cupo disponible: <strong>{{ cuposRestantes }}</strong> beneficiarios restantes.</p>
      </div>
      <div class="overflow-y-auto flex-1 p-6">
        <BeneficiarioForm ref="formRef" v-model="draft" @valid-submit="emit('submit')" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="formRef?.submit()" class="h-9 px-6 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
          {{ modo === 'nuevo' ? 'Agregar beneficiario' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>
