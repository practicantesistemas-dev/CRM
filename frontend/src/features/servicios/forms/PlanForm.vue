<script setup lang="ts">
import { watch } from 'vue'
import { Layers } from 'lucide-vue-next'
import type { PlanDraft } from '../services/servicios.api'
import { planSchema } from '../schemas/plan.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import { CUPO_MAXIMO } from '@/features/plan-liga/constants/plan-liga.constants'
import FieldError from '@/shared/components/FieldError.vue'

defineProps<{ categoriaFija?: string }>()
const draft = defineModel<PlanDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(planSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

// "Beneficiarios" es el total del plan; "adicionales" no se digita, se calcula solo: lo que
// pasa del cupo base de un grupo (CUPO_MAXIMO, el mismo tope que usa la carga masiva de Plan
// Liga para armar cada grupo titular+beneficiarios). Ej: 5 beneficiarios -> 1 adicional.
watch(() => draft.value.beneficiarios, (nuevo) => {
  draft.value.beneficiariosAdicionales = Math.max(0, (nuevo ?? 0) - CUPO_MAXIMO)
}, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Servicio (categoría) *</label>
      <div v-if="categoriaFija" class="relative">
        <Layers :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input :value="categoriaFija" disabled class="w-full h-10 pl-9 pr-4 rounded-lg input-surface text-[12px] text-body outline-none opacity-70 cursor-not-allowed" />
      </div>
      <template v-else>
        <div class="relative">
          <Layers :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input v-model="draft.categoria" @blur="tocar('categoria')" placeholder="Ej: planliga" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('categoria') && !!errors.categoria, esVisible('categoria') && !errors.categoria && !!draft.categoria, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
        </div>
        <FieldError :message="esVisible('categoria') ? errors.categoria : undefined" />
      </template>
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Nombre del plan *</label>
      <input v-model="draft.nombre" @blur="tocar('nombre')" placeholder="Ej: 6 Beneficiarios" class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Tipo de cliente</label>
      <select v-model="draft.tipoCliente" class="w-full h-10 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer">
        <option value="Particular">Particular</option>
        <option value="Empresarial">Empresarial</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Beneficiarios *</label>
      <input v-model.number="draft.beneficiarios" @blur="tocar('beneficiarios')" type="number" min="0" class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('beneficiarios') && !!errors.beneficiarios, false, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('beneficiarios') ? errors.beneficiarios : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Beneficiarios adicionales</label>
      <input :value="draft.beneficiariosAdicionales" type="number" disabled class="w-full h-10 px-4 rounded-lg input-surface text-[12px] outline-none opacity-70 cursor-not-allowed" />
      <p class="text-[10px] text-muted mt-1">Se calcula solo: lo que pasa de {{ CUPO_MAXIMO }} (cupo base de un grupo). Ej: {{ CUPO_MAXIMO + 1 }} beneficiarios → 1 adicional.</p>
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Descripción</label>
      <textarea v-model="draft.descripcion" rows="2" placeholder="Descripción breve del plan" class="w-full px-4 py-2.5 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all resize-none" />
    </div>
  </div>
</template>
