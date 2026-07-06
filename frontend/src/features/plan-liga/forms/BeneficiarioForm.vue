<script setup lang="ts">
import type { BeneficiarioDraft } from '../types/plan-liga'
import { PARENTESCOS } from '../constants/plan-liga.constants'
import { beneficiarioSchema } from '../schemas/beneficiario.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<BeneficiarioDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, submitted, onValidSubmit } = useZodForm(beneficiarioSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const nombre = useNombreCompuesto(draft, 'nombre')
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
      <div class="grid grid-cols-2 gap-3">
        <input v-model="nombre.nombre1" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nombre, submitted && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.nombre2" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nombre, submitted && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.apellido1" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nombre, submitted && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.apellido2" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nombre, submitted && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
      </div>
      <FieldError :message="errors.nombre" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
      <input v-model="draft.documento" placeholder="Número documento" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.documento, submitted && !!draft.documento, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="errors.documento" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha nacimiento</label>
      <input v-model="draft.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Parentesco</label>
      <select v-model="draft.parentesco" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option v-for="p in PARENTESCOS" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="Reemplazado">Reemplazado</option>
        <option value="Retirado">Retirado</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha inscripción</label>
      <input v-model="draft.fechaInscripcion" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
  </div>
</template>
