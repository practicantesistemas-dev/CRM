<script setup lang="ts">
import { Layers, Hash, User } from 'lucide-vue-next'
import type { ServicioDraft } from '../types/servicio'
import { servicioSchema } from '../schemas/servicio.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<ServicioDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(servicioSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
      <div class="relative">
        <Layers :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.nombre" @blur="tocar('nombre')" placeholder="Ej: Plan Liga Empresarial" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Código *</label>
      <div class="relative">
        <Hash :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.codigo" @blur="tocar('codigo')" placeholder="PLE-001" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('codigo') && !!errors.codigo, esVisible('codigo') && !errors.codigo && !!draft.codigo, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('codigo') ? errors.codigo : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Categoría</label>
      <input v-model="draft.categoria" placeholder="Ej: Plan Liga" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo</label>
      <select v-model="draft.tipo" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="Empresarial">Empresarial</option>
        <option value="Individual">Individual</option>
        <option value="Bienestar">Bienestar</option>
        <option value="Salud">Salud</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
      <div class="relative">
        <User :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <select v-model="draft.responsable" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="">Seleccionar</option>
          <option value="María García">María García</option>
          <option value="Juan López">Juan López</option>
          <option value="Carlos Torres">Carlos Torres</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="En revisión">En revisión</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor Potencial</label>
      <input v-model="draft.valorPotencial" placeholder="Ej: $10.000.000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
  </div>
</template>
