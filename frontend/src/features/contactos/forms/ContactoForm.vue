<script setup lang="ts">
import { ref, computed } from 'vue'
import { User, Mail, Phone, Building2, Briefcase, MapPin, Calendar, UserCheck, Tag, X } from 'lucide-vue-next'
import type { ContactoDraft } from '../types/contacto'
import { etiquetaColor } from '../constants/contactos.constants'
import { contactoSchema } from '../schemas/contacto.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { faltaApellido } from '@/shared/utils/nombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<ContactoDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(contactoSchema, draft)
const nombre = useNombreCompuesto(draft, 'nombre')
const apellidoFaltante = computed(() => faltaApellido(nombre))

defineExpose({ submit: onValidSubmit(() => { if (!apellidoFaltante.value) emit('validSubmit') }) })

const etiquetaInput = ref('')

const agregarEtiqueta = () => {
  const tag = etiquetaInput.value.trim()
  if (tag && !draft.value.etiquetas.includes(tag)) draft.value.etiquetas.push(tag)
  etiquetaInput.value = ''
}
const quitarEtiqueta = (tag: string) => {
  draft.value.etiquetas = draft.value.etiquetas.filter(t => t !== tag)
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
      <div class="grid grid-cols-2 gap-3">
        <div class="relative">
          <User :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="nombre.nombre1" @blur="tocar('nombre')" placeholder="Primer nombre" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
        </div>
        <input v-model="nombre.nombre2" @blur="tocar('nombre')" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="nombre.apellido1" @blur="tocar('nombre')" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="nombre.apellido2" @blur="tocar('nombre')" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('nombre') && (!!errors.nombre || apellidoFaltante), esVisible('nombre') && !errors.nombre && !apellidoFaltante && !!draft.nombre, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('nombre') ? (apellidoFaltante ? 'Falta el apellido: mínimo un nombre y un apellido' : errors.nombre) : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo documento</label>
      <select v-model="draft.tipoDocumento" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="CC">Cédula de Ciudadanía (CC)</option>
        <option value="CE">Cédula de Extranjería (CE)</option>
        <option value="TI">Tarjeta de Identidad (TI)</option>
        <option value="NIT">NIT</option>
        <option value="PP">Pasaporte (PP)</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Número de documento</label>
      <input v-model="draft.documento" @blur="tocar('documento')" placeholder="Ej: 10293844" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('documento') && !!errors.documento, esVisible('documento') && !errors.documento && !!draft.documento, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('documento') ? errors.documento : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo electrónico *</label>
      <div class="relative"><Mail :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.correo" @blur="tocar('correo')" type="email" placeholder="correo@empresa.com" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('correo') && !!errors.correo, esVisible('correo') && !errors.correo && !!draft.correo, 'border-slate-200 focus:border-[#2447F9]')" /></div>
      <FieldError :message="esVisible('correo') ? errors.correo : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
      <div class="relative"><Phone :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.telefono" @blur="tocar('telefono')" placeholder="300-000-0000" class="w-full h-10 pl-9 pr-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('telefono') && !!errors.telefono, esVisible('telefono') && !errors.telefono && !!draft.telefono, 'border-slate-200 focus:border-[#2447F9]')" /></div>
      <FieldError :message="esVisible('telefono') ? errors.telefono : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
      <div class="relative"><Building2 :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.empresa" placeholder="Nombre de la empresa" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Cargo</label>
      <div class="relative"><Briefcase :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.cargo" placeholder="Ej: Gerente Comercial" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad</label>
      <div class="relative"><MapPin :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.ciudad" placeholder="Ej: 001" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option><option value="Inactivo">Inactivo</option>
        <option value="Prospecto">Prospecto</option><option value="En proceso">En proceso</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
      <div class="relative"><Calendar :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="draft.fechaNacimiento" type="date" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
      <div class="relative"><UserCheck :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <select v-model="draft.responsable" class="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
          <option value="">Seleccionar responsable</option>
          <option value="María García">María García</option>
          <option value="Juan López">Juan López</option>
          <option value="Carlos Torres">Carlos Torres</option>
        </select></div>
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etiquetas</label>
      <div class="flex gap-2 mb-2 flex-wrap">
        <span v-for="tag in draft.etiquetas" :key="tag" class="inline-flex items-center gap-1 text-[10px] font-semibold" :class="etiquetaColor(tag)">
          {{ tag }}<button @click="quitarEtiqueta(tag)" class="hover:opacity-70"><X :size="9" /></button>
        </span>
      </div>
      <div class="flex gap-2">
        <div class="relative flex-1"><Tag :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="etiquetaInput" placeholder="Escribir etiqueta y presionar Enter..." @keydown.enter.prevent="agregarEtiqueta"
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
        <button @click="agregarEtiqueta" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Agregar</button>
      </div>
    </div>
  </div>
</template>
