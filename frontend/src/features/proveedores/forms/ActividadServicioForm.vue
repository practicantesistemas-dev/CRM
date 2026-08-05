<script setup lang="ts">
import type { ActividadServicioDraft } from '../types/actividadServicio'
import { actividadServicioSchema } from '../schemas/actividadServicio.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<ActividadServicioDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(actividadServicioSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
      <input v-model="draft.nombre" @blur="tocar('nombre')" placeholder="Nombre del servicio"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all"
        :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Cantidad</label>
      <input v-model.number="draft.cantidad" @blur="tocar('cantidad')" type="number" min="0" placeholder="0"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all"
        :class="fieldStateClass(esVisible('cantidad') && !!errors.cantidad, false, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('cantidad') ? errors.cantidad : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Precio</label>
      <input v-model.number="draft.precio" @blur="tocar('precio')" type="number" min="0" placeholder="0"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all"
        :class="fieldStateClass(esVisible('precio') && !!errors.precio, false, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('precio') ? errors.precio : undefined" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Descripción</label>
      <textarea v-model="draft.descripcion" rows="2" placeholder="Detalle del servicio (opcional)"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none" />
    </div>
  </div>
</template>
