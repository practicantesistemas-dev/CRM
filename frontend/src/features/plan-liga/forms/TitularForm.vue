<script setup lang="ts">
import type { TitularDraft } from '../types/plan-liga'
import { titularSchema } from '../schemas/titular.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<TitularDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(titularSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const nombre = useNombreCompuesto(draft, 'nombre')
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
      <div class="grid grid-cols-2 gap-3">
        <input v-model="nombre.nombre1" @blur="tocar('nombre')" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.nombre2" @blur="tocar('nombre')" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.apellido1" @blur="tocar('nombre')" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
        <input v-model="nombre.apellido2" @blur="tocar('nombre')" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
      </div>
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de documento</label>
      <select v-model="draft.tipoDocumento" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="CC">Cédula de Ciudadanía (CC)</option>
        <option value="CE">Cédula de Extranjería (CE)</option>
        <option value="TI">Tarjeta de Identidad (TI)</option>
        <option value="NIT">NIT</option>
        <option value="PP">Pasaporte (PP)</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
      <input v-model="draft.documento" @blur="tocar('documento')" placeholder="Número de documento" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('documento') && !!errors.documento, esVisible('documento') && !errors.documento && !!draft.documento, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('documento') ? errors.documento : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
      <input v-model="draft.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
      <input v-model="draft.correo" @blur="tocar('correo')" type="email" placeholder="correo@empresa.com" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('correo') && !!errors.correo, esVisible('correo') && !errors.correo && !!draft.correo, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('correo') ? errors.correo : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
      <input v-model="draft.telefono" @blur="tocar('telefono')" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('telefono') && !!errors.telefono, esVisible('telefono') && !errors.telefono && !!draft.telefono, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('telefono') ? errors.telefono : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Sexo</label>
      <select v-model="draft.sexo" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
        <option value="Otro">Otro</option>
      </select>
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Dirección</label>
      <input v-model="draft.direccion" placeholder="Dirección de residencia" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad</label>
      <input v-model="draft.ciudad" placeholder="Código o nombre de ciudad" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Departamento</label>
      <input v-model="draft.departamento" placeholder="Código o nombre de departamento" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Plan contratado</label>
      <select v-model="draft.planContratado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
        <option value="Plan Liga Individual">Plan Liga Individual</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de plan</label>
      <input v-model="draft.tipoPlan" placeholder="Tipo de plan" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de afiliado</label>
      <input v-model="draft.tipoAfiliado" placeholder="Tipo de afiliado" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">EPS</label>
      <input v-model="draft.eps" placeholder="EPS" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Otra EPS</label>
      <input v-model="draft.otraEps" placeholder="Solo si la EPS no está en la lista" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Plan de salud</label>
      <input v-model="draft.planSalud" placeholder="Plan de salud" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre del plan</label>
      <input v-model="draft.planNombre" placeholder="Nombre del plan" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de inscripción</label>
      <input v-model="draft.fechaInscripcion" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
  </div>
</template>
