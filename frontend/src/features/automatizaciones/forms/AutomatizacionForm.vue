<script setup lang="ts">
import type { AutomatizacionDraft } from '../types/automatizacion'
import { ACCIONES } from '../constants/automatizaciones.constants'
import { automatizacionSchema } from '../schemas/automatizacion.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<AutomatizacionDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(automatizacionSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Nombre *</label>
      <input
        v-model="draft.nombre"
        @blur="tocar('nombre')"
        placeholder="Ej: Bienvenida nuevo contacto"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all"
        :class="fieldStateClass(esVisible('nombre') && !!errors.nombre, esVisible('nombre') && !errors.nombre && !!draft.nombre, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')"
      />
      <FieldError :message="esVisible('nombre') ? errors.nombre : undefined" />
    </div>

    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Descripción</label>
      <textarea
        v-model="draft.descripcion"
        placeholder="¿Qué hace esta automatización?"
        rows="2"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
      />
    </div>

    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Acción</label>
      <select
        v-model="draft.accion"
        class="w-full h-10 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all cursor-pointer"
      >
        <option v-for="a in ACCIONES" :key="a" :value="a">{{ a }}</option>
      </select>
    </div>

    <div v-if="draft.accion === 'Enviar correo'">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Correos destino *</label>
      <input
        v-model="draft.correos"
        @blur="tocar('correos')"
        placeholder="correo1@dominio.com, correo2@dominio.com"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all"
        :class="fieldStateClass(esVisible('correos') && !!errors.correos, esVisible('correos') && !errors.correos && !!draft.correos, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')"
      />
      <FieldError :message="esVisible('correos') ? errors.correos : undefined" />
      <p class="text-[10px] text-muted mt-1">Se envían a n8n al guardar la automatización. Separa varios correos con comas.</p>
    </div>

    <div v-if="draft.accion === 'Enviar correo'">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Asunto *</label>
      <input
        v-model="draft.asunto"
        @blur="tocar('asunto')"
        placeholder="Ej: ¡Bienvenido a Liga Contra el Cáncer!"
        class="w-full h-10 px-4 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all"
        :class="fieldStateClass(esVisible('asunto') && !!errors.asunto, esVisible('asunto') && !errors.asunto && !!draft.asunto, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')"
      />
      <FieldError :message="esVisible('asunto') ? errors.asunto : undefined" />
    </div>

    <div v-if="draft.accion === 'Enviar correo'">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Cuerpo del correo *</label>
      <textarea
        v-model="draft.cuerpo"
        @blur="tocar('cuerpo')"
        placeholder="Escribe el mensaje que recibirá el destinatario..."
        rows="4"
        class="w-full px-4 py-2.5 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all resize-none"
        :class="fieldStateClass(esVisible('cuerpo') && !!errors.cuerpo, esVisible('cuerpo') && !errors.cuerpo && !!draft.cuerpo, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')"
      />
      <FieldError :message="esVisible('cuerpo') ? errors.cuerpo : undefined" />
      <p class="text-[11px] font-bold text-heading mt-1.5">
        Al final se agrega automáticamente un aviso de "no responder" (es un correo automático).
      </p>
    </div>
  </div>
</template>
