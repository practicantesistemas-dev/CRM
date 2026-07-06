<script setup lang="ts">
import type { CampanaDraft } from '../types/campana'
import { campanaSchema } from '../schemas/campana.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<CampanaDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, submitted, onValidSubmit } = useZodForm(campanaSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre de la campaña *</label>
      <input v-model="draft.nombre" placeholder="Ej: Bienvenida Plan Liga Q3" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(!!errors.nombre, submitted && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="errors.nombre" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Segmento destinatario</label>
      <select v-model="draft.segmento" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar segmento</option>
        <option value="Todos">Todos los contactos</option>
        <option value="Empresas VIP Pereira">Empresas VIP Pereira</option>
        <option value="Prospectos sin gestión">Prospectos sin gestión</option>
        <option value="Brigadas Medellín Q3">Brigadas Medellín Q3</option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
        <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="Borrador">Borrador</option>
          <option value="Programada">Programada</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha envío</label>
        <input v-model="draft.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
    </div>
  </div>
</template>
