<script setup lang="ts">
import type { OportunidadDraft } from '../types/oportunidad'
import { ETAPAS } from '../constants/oportunidades.constants'
import { oportunidadSchema } from '../schemas/oportunidad.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<OportunidadDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, submitted, onValidSubmit } = useZodForm(oportunidadSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const contacto = useNombreCompuesto(draft, 'contacto')
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.empresa, submitted && !!draft.empresa, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="errors.empresa" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input v-model="contacto.nombre1" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.contacto, submitted && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.nombre2" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.contacto, submitted && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.apellido1" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.contacto, submitted && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.apellido2" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.contacto, submitted && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="errors.contacto" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Servicio *</label>
      <select v-model="draft.servicio" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(!!errors.servicio, submitted && !!draft.servicio, 'border-slate-200 focus:border-[#2447F9]')">
        <option value="">Seleccionar servicio</option>
        <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
        <option value="Plan Liga Individual">Plan Liga Individual</option>
        <option value="Tamizajes">Tamizajes</option>
        <option value="Brigadas de Salud">Brigadas de Salud</option>
        <option value="Capacitaciones">Capacitaciones</option>
        <option value="Programas de Bienestar">Programas de Bienestar</option>
      </select>
      <FieldError :message="errors.servicio" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
      <input v-model="draft.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Probabilidad ({{ draft.probabilidad }}%)</label>
      <input v-model.number="draft.probabilidad" type="range" min="0" max="100" step="5" class="w-full h-2 rounded-lg appearance-none cursor-pointer mt-3" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etapa</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option v-for="e in ETAPAS" :key="e" :value="e">{{ e }}</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
      <select v-model="draft.responsable" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar</option>
        <option value="María García">María García</option>
        <option value="Juan López">Juan López</option>
        <option value="Carlos Torres">Carlos Torres</option>
      </select>
    </div>
  </div>
</template>
