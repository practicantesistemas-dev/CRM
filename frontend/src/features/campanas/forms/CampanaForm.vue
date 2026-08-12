<script setup lang="ts">
import type { CampanaDraft } from '../types/campana'
import { campanaSchema } from '../schemas/campana.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'
import FechaInput from '@/shared/components/FechaInput.vue'

const draft = defineModel<CampanaDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(campanaSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Nombre de la campaña *</label>
      <input v-model="draft.nombre" @blur="tocar('nombre')" placeholder="Ej: Bienvenida Plan Liga Q3" class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Segmento destinatario</label>
      <select v-model="draft.segmento" class="w-full h-10 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer">
        <option value="">Seleccionar segmento</option>
        <option value="Todos">Todos los contactos</option>
        <option value="Empresas VIP Pereira">Empresas VIP Pereira</option>
        <option value="Prospectos sin gestión">Prospectos sin gestión</option>
        <option value="Brigadas Medellín Q3">Brigadas Medellín Q3</option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Estado</label>
        <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer">
          <option value="Borrador">Borrador</option>
          <option value="Programada">Programada</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Fecha envío</label>
        <FechaInput v-model="draft.fecha" />
      </div>
    </div>
  </div>
</template>
