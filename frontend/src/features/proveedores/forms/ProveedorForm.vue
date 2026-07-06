<script setup lang="ts">
import type { ProveedorDraft } from '../types/proveedor'
import { proveedorSchema } from '../schemas/proveedor.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<ProveedorDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, onValidSubmit } = useZodForm(proveedorSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
      <input v-model="draft.nombre" placeholder="Nombre del proveedor" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="errors.nombre ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#2447F9]'" />
      <FieldError :message="errors.nombre" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Categoría</label>
      <input v-model="draft.categoria" placeholder="Ej: Insumos Médicos" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">NIT</label>
      <input v-model="draft.nit" placeholder="900.000.000-0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
      <input v-model="draft.correo" type="email" placeholder="correo@proveedor.com" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="errors.correo ? 'border-red-300 focus:border-red-400' : 'border-slate-200 focus:border-[#2447F9]'" />
      <FieldError :message="errors.correo" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
      <input v-model="draft.telefono" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
  </div>
</template>
