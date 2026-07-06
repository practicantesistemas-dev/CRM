<script setup lang="ts">
import { Building2, Hash, MapPin, User } from 'lucide-vue-next'
import type { EmpresaDraft } from '../types/empresa'
import { empresaSchema } from '../schemas/empresa.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<EmpresaDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, submitted, onValidSubmit } = useZodForm(empresaSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Razón Social *</label>
      <div class="relative">
        <Building2 :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.razonSocial" placeholder="Ej: Global Tech S.A.S" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.razonSocial, submitted && !!draft.razonSocial, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="errors.razonSocial" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">NIT *</label>
      <div class="relative">
        <Hash :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.nit" placeholder="900.000.000-0" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nit, submitted && !!draft.nit, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="errors.nit" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Industria</label>
      <input v-model="draft.industria" placeholder="Ej: Tecnología" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Dirección</label>
      <div class="relative">
        <MapPin :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.direccion" placeholder="Ej: Cra 8 #20-15" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad</label>
      <input v-model="draft.ciudad" placeholder="Ej: Pereira" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
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
        <option value="Activa">Activa</option>
        <option value="Inactiva">Inactiva</option>
        <option value="Prospecto">Prospecto</option>
      </select>
    </div>
  </div>
</template>
