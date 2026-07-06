<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import type { ContactoDraft } from '../types/contacto'
import ContactoForm from '../forms/ContactoForm.vue'

defineProps<{ modo: 'nuevo' | 'editar' }>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<ContactoDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof ContactoForm>>()
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modo === 'nuevo' ? 'Nuevo Contacto' : 'Editar Contacto' }}</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Complete todos los campos requeridos</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="overflow-y-auto flex-1 p-6">
        <ContactoForm ref="formRef" v-model="draft" @valid-submit="emit('submit')" />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancelar</button>
        <button @click="formRef?.submit()" class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          {{ modo === 'nuevo' ? 'Crear contacto' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>
