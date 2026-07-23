<script setup lang="ts">
import { computed } from 'vue'
import type { BeneficiarioDraft } from '../types/plan-liga'
import { beneficiarioSchema } from '../schemas/beneficiario.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { faltaApellido } from '@/shared/utils/nombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const props = defineProps<{ modo?: 'nuevo' | 'editar' }>()
const draft = defineModel<BeneficiarioDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(beneficiarioSchema, draft)
const nombre = useNombreCompuesto(draft, 'nombre')
const apellidoFaltante = computed(() => faltaApellido(nombre))

defineExpose({ submit: onValidSubmit(() => { if (!apellidoFaltante.value) emit('validSubmit') }) })

// Fecha de inscripción y estado quedan fijados al crear el beneficiario: se muestran
// de solo lectura en edición para evitar registrar cambios que nunca se guardan.
// El estado solo se cambia desde el botón de desactivar en la lista de beneficiarios.
const soloLecturaEnEdicion = computed(() => props.modo === 'editar')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-1 border-b border-slate-100">Identificación</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
          <div class="grid grid-cols-2 gap-3">
            <input v-model="nombre.nombre1" @blur="tocar('nombre')" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.nombre2" @blur="tocar('nombre')" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.apellido1" @blur="tocar('nombre')" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
            <input v-model="nombre.apellido2" @blur="tocar('nombre')" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#EC4899]')" />
          </div>
          <FieldError :message="esVisible('nombre') ? (apellidoFaltante ? 'Falta el apellido: mínimo un nombre y un apellido' : errors.nombre) : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de documento *</label>
          <select v-model="draft.tipoDocumento" @change="tocar('tipoDocumento')" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(esVisible('tipoDocumento') && !!errors.tipoDocumento, esVisible('tipoDocumento') && !errors.tipoDocumento && !!draft.tipoDocumento, 'border-slate-200 focus:border-[#EC4899]')">
            <option value="CC">Cédula de Ciudadanía (CC)</option>
            <option value="CE">Cédula de Extranjería (CE)</option>
            <option value="TI">Tarjeta de Identidad (TI)</option>
            <option value="RC">Registro Civil (RC)</option>
            <option value="PP">Pasaporte (PP)</option>
          </select>
          <FieldError :message="esVisible('tipoDocumento') ? errors.tipoDocumento : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
          <input v-model="draft.documento" @blur="tocar('documento')" placeholder="Número documento" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('documento') && !!errors.documento, esVisible('documento') && !errors.documento && !!draft.documento, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('documento') ? errors.documento : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha nacimiento</label>
          <input v-model="draft.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Sexo biológico</label>
          <select v-model="draft.sexo" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
            <option value="">Sin especificar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
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
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad *</label>
          <input v-model="draft.ciudad" @blur="tocar('ciudad')" placeholder="Ej: 001" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('ciudad') && !!errors.ciudad, esVisible('ciudad') && !errors.ciudad && !!draft.ciudad, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('ciudad') ? errors.ciudad : undefined" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Departamento *</label>
          <input v-model="draft.departamento" @blur="tocar('departamento')" placeholder="Ej: 66" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('departamento') && !!errors.departamento, esVisible('departamento') && !errors.departamento && !!draft.departamento, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('departamento') ? errors.departamento : undefined" />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
          <input v-model="draft.empresa" placeholder="Nombre empresa (si aplica)" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-4 border-b border-slate-100">Plan</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de plan</label>
          <input v-model="draft.tipoPlan" placeholder="Tipo de plan" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
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
        <div class="sm:col-span-2">
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre del plan</label>
          <input v-model="draft.planNombre" placeholder="Nombre comercial del plan" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
      </div>
    </div>

    <div>
      <h4 class="text-[10px] font-bold text-[#EC4899] uppercase tracking-wider pb-2 mb-4 border-b border-slate-100">Estado</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
          <select v-model="draft.estado" :disabled="soloLecturaEnEdicion" title="Usa el botón de desactivar en la lista de beneficiarios para cambiar el estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Reemplazado">Reemplazado</option>
            <option value="Retirado">Retirado</option>
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha inscripción *</label>
          <input v-model="draft.fechaInscripcion" @blur="tocar('fechaInscripcion')" type="date" :disabled="soloLecturaEnEdicion" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('fechaInscripcion') && !!errors.fechaInscripcion, esVisible('fechaInscripcion') && !errors.fechaInscripcion && !!draft.fechaInscripcion, 'border-slate-200 focus:border-[#EC4899]')" />
          <FieldError :message="esVisible('fechaInscripcion') ? errors.fechaInscripcion : undefined" />
        </div>
      </div>
    </div>
  </div>
</template>
