<script setup lang="ts">
import { computed, watch } from 'vue'
import type { PlanServicio, TitularDraft } from '../types/plan-liga'
import { titularSchema } from '../schemas/titular.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { faltaApellido } from '@/shared/utils/nombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const props = defineProps<{ modo?: 'nuevo' | 'editar'; planesServicio?: PlanServicio[] }>()
const draft = defineModel<TitularDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(titularSchema, draft)
const nombre = useNombreCompuesto(draft, 'nombre')
const apellidoFaltante = computed(() => faltaApellido(nombre))

// El nombre del plan se guarda aparte (solo para mostrarlo en la tabla); el que
// realmente se envía al crear el titular es el id (servicioId → SERVICIO_ID).
watch(() => draft.value.servicioId, (id) => {
  draft.value.planContratado = props.planesServicio?.find(p => p.id === id)?.nombre ?? ''
})

defineExpose({ submit: onValidSubmit(() => { if (!apellidoFaltante.value) emit('validSubmit') }) })

// Fecha de inscripción y estado quedan fijados al crear el titular: se muestran de
// solo lectura en edición para evitar registrar cambios que nunca se guardan.
// El estado solo se cambia desde el botón de activar/desactivar en la tabla.
const soloLecturaEnEdicion = computed(() => props.modo === 'editar')
const hoy = new Date().toISOString().split('T')[0]
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <option value="NIT">NIT</option>
        <option value="PP">Pasaporte (PP)</option>
      </select>
      <FieldError :message="esVisible('tipoDocumento') ? errors.tipoDocumento : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
      <input v-model="draft.documento" @blur="tocar('documento')" placeholder="Número de documento" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('documento') && !!errors.documento, esVisible('documento') && !errors.documento && !!draft.documento, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('documento') ? errors.documento : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento *</label>
      <input v-model="draft.fechaNacimiento" @blur="tocar('fechaNacimiento')" type="date" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('fechaNacimiento') && !!errors.fechaNacimiento, esVisible('fechaNacimiento') && !errors.fechaNacimiento && !!draft.fechaNacimiento, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('fechaNacimiento') ? errors.fechaNacimiento : undefined" />
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
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Sexo biológico *</label>
      <select v-model="draft.sexo" @change="tocar('sexo')" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(esVisible('sexo') && !!errors.sexo, esVisible('sexo') && !errors.sexo && !!draft.sexo, 'border-slate-200 focus:border-[#EC4899]')">
        <option value="">Sin especificar</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
      <FieldError :message="esVisible('sexo') ? errors.sexo : undefined" />
    </div>
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
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Plan contratado *</label>
      <select v-model="draft.servicioId" @change="tocar('planContratado')" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(esVisible('planContratado') && !!errors.planContratado, esVisible('planContratado') && !errors.planContratado && !!draft.planContratado, 'border-slate-200 focus:border-[#EC4899]')">
        <option :value="null">Selecciona un plan</option>
        <option v-for="p in props.planesServicio" :key="p.id" :value="p.id">{{ p.nombre }}</option>
      </select>
      <FieldError :message="esVisible('planContratado') ? errors.planContratado : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de plan *</label>
      <input v-model="draft.tipoPlan" @blur="tocar('tipoPlan')" placeholder="Liga - Energia - Camara" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('tipoPlan') && !!errors.tipoPlan, esVisible('tipoPlan') && !errors.tipoPlan && !!draft.tipoPlan, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('tipoPlan') ? errors.tipoPlan : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de afiliado</label>
      <input :value="draft.tipoAfiliado" disabled title="El titular siempre se crea como tipo de afiliado 1 (cotizante)" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-[12px] outline-none cursor-not-allowed" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">EPS *</label>
      <input v-model="draft.eps" @blur="tocar('eps')" placeholder="EPS" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('eps') && !!errors.eps, esVisible('eps') && !errors.eps && !!draft.eps, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('eps') ? errors.eps : undefined" />
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
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre del plan *</label>
      <input v-model="draft.planNombre" @blur="tocar('planNombre')" placeholder="Nombre comercial del plan" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('planNombre') && !!errors.planNombre, esVisible('planNombre') && !errors.planNombre && !!draft.planNombre, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('planNombre') ? errors.planNombre : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de inscripción *</label>
      <input v-model="draft.fechaInscripcion" @blur="tocar('fechaInscripcion')" type="date" :max="hoy" :disabled="soloLecturaEnEdicion" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" :class="fieldStateClass(esVisible('fechaInscripcion') && !!errors.fechaInscripcion, esVisible('fechaInscripcion') && !errors.fechaInscripcion && !!draft.fechaInscripcion, 'border-slate-200 focus:border-[#EC4899]')" />
      <FieldError :message="esVisible('fechaInscripcion') ? errors.fechaInscripcion : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" disabled title="El titular se crea como Activo; usa el botón de activar/desactivar en la tabla para cambiar el estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
  </div>
</template>
