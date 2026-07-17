<script setup lang="ts">
import { computed } from 'vue'
import type { BeneficiarioDraft } from '../types/plan-liga'
import { beneficiarioSchema } from '../schemas/beneficiario.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const props = defineProps<{ modo?: 'nuevo' | 'editar' }>()
const draft = defineModel<BeneficiarioDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(beneficiarioSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const nombre = useNombreCompuesto(draft, 'nombre')

// La identidad (nombre, documento, fecha de nacimiento, sexo) y la fecha de inscripción
// quedan fijadas al crear el beneficiario: el PATCH de edición no las toca, así que se
// muestran de solo lectura para evitar registrar cambios que nunca se guardan.
const soloIdentidad = computed(() => props.modo === 'editar')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-1 border-b border-slate-100">Identificación</h4>
      <p v-if="soloIdentidad" class="text-[10px] text-slate-400 mb-3">Estos datos no se pueden modificar desde aquí.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" :class="{ 'mt-3': !soloIdentidad }">
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
          <div class="grid grid-cols-2 gap-3">
            <input v-model="nombre.nombre1" :disabled="soloIdentidad" @blur="tocar('nombre')" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.nombre2" :disabled="soloIdentidad" @blur="tocar('nombre')" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.apellido1" :disabled="soloIdentidad" @blur="tocar('nombre')" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.apellido2" :disabled="soloIdentidad" @blur="tocar('nombre')" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
          </div>
          <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de documento</label>
          <select v-model="draft.tipoDocumento" :disabled="soloIdentidad" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed">
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="RC">Registro Civil (RC)</option>
            <option value="PP">Pasaporte (PP)</option>
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
          <input v-model="draft.documento" :disabled="soloIdentidad" @blur="tocar('documento')" placeholder="Número documento" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('documento') && !!errors.documento, esVisible('documento') && !errors.documento && !!draft.documento, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('documento') ? errors.documento : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha nacimiento</label>
          <input v-model="draft.fechaNacimiento" type="date" :disabled="soloIdentidad" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Sexo</label>
          <select v-model="draft.sexo" :disabled="soloIdentidad" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed">
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-4 border-b border-slate-100">Contacto</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
          <input v-model="draft.correo" @blur="tocar('correo')" type="email" placeholder="correo@ejemplo.com" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('correo') && !!errors.correo, esVisible('correo') && !errors.correo && !!draft.correo, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('correo') ? errors.correo : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
          <input v-model="draft.telefono" @blur="tocar('telefono')" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('telefono') && !!errors.telefono, esVisible('telefono') && !errors.telefono && !!draft.telefono, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('telefono') ? errors.telefono : undefined" />
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-4 border-b border-slate-100">Ubicación</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
          <input v-model="draft.empresa" placeholder="Nombre empresa (si aplica)" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-4 border-b border-slate-100">Estado</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <input v-model="draft.fechaInscripcion" type="date" :disabled="soloIdentidad" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" />
        </div>
      </div>
    </div>
  </div>
</template>
