<script setup lang="ts">
import Select from 'primevue/select'
import { Building2, Hash, MapPin } from 'lucide-vue-next'
import type { EmpresaDraft } from '../types/empresa'
import { empresaSchema } from '../schemas/empresa.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useUbicaciones } from '@/shared/composables/useUbicaciones'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<EmpresaDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(empresaSchema, draft)
// Empresa solo guarda el nombre de la ciudad (sin departamento asociado, a diferencia de
// Contacto/Titular), así que el Select usa option-value="nombre" en vez del código DIVIPOLA.
const { municipios, cargandoUbicaciones } = useUbicaciones()
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Razón Social *</label>
      <div class="relative">
        <Building2 :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input v-model="draft.razonSocial" @blur="tocar('razonSocial')" placeholder="Ej: Global Tech S.A.S" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('razonSocial') && !!errors.razonSocial, esVisible('razonSocial') && !errors.razonSocial && !!draft.razonSocial, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('razonSocial') ? errors.razonSocial : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">NIT *</label>
      <div class="relative">
        <Hash :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input v-model="draft.nit" @blur="tocar('nit')" placeholder="900.000.000-0" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('nit') && !!errors.nit, esVisible('nit') && !errors.nit && !!draft.nit, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('nit') ? errors.nit : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Industria *</label>
      <input v-model="draft.industria" @blur="tocar('industria')" placeholder="Ej: Tecnología" class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('industria') && !!errors.industria, esVisible('industria') && !errors.industria && !!draft.industria, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('industria') ? errors.industria : undefined" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Dirección *</label>
      <div class="relative">
        <MapPin :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input v-model="draft.direccion" @blur="tocar('direccion')" placeholder="Ej: Cra 8 #20-15" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all" :class="fieldStateClass(esVisible('direccion') && !!errors.direccion, esVisible('direccion') && !errors.direccion && !!draft.direccion, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('direccion') ? errors.direccion : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Ciudad *</label>
      <Select v-model="draft.ciudad" @change="tocar('ciudad')" :options="municipios" option-label="nombre" option-value="nombre"
        filter filter-placeholder="Buscar ciudad..." :loading="cargandoUbicaciones" placeholder="Selecciona una ciudad"
        empty-filter-message="Sin resultados" empty-message="Sin ciudades" class="w-full" input-class="h-10 text-[12px] flex items-center"
        :class="fieldStateClass(esVisible('ciudad') && !!errors.ciudad, esVisible('ciudad') && !errors.ciudad && !!draft.ciudad, '')" />
      <FieldError :message="esVisible('ciudad') ? errors.ciudad : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wide">Estado *</label>
      <select :value="draft.estado ? 'Activa' : 'Inactiva'" @change="draft.estado = ($event.target as HTMLSelectElement).value === 'Activa'" class="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-[12px] text-slate-900 dark:text-slate-100 outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer">
        <option value="Activa">Activa</option>
        <option value="Inactiva">Inactiva</option>
      </select>
    </div>
  </div>
</template>
