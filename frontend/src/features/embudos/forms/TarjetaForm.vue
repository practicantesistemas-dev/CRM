<script setup lang="ts">
import { computed } from 'vue'
import type { TarjetaDraft } from '../types/tarjeta'
import { tarjetaSchema } from '../schemas/tarjeta.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { faltaApellido } from '@/shared/utils/nombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'

const draft = defineModel<TarjetaDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(tarjetaSchema, draft)
const contacto = useNombreCompuesto(draft, 'contacto')
const apellidoFaltante = computed(() => faltaApellido(contacto))

defineExpose({ submit: onValidSubmit(() => { if (!apellidoFaltante.value) emit('validSubmit') }) })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
      <input v-model="draft.empresa" @blur="tocar('empresa')" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('empresa') && !!errors.empresa, esVisible('empresa') && !errors.empresa && !!draft.empresa, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('empresa') ? errors.empresa : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
      <div class="grid grid-cols-2 gap-3">
        <input v-model="contacto.nombre1" @blur="tocar('contacto')" placeholder="Primer nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('contacto') && (!!errors.contacto || apellidoFaltante), esVisible('contacto') && !errors.contacto && !apellidoFaltante && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.nombre2" @blur="tocar('contacto')" placeholder="Segundo nombre" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('contacto') && (!!errors.contacto || apellidoFaltante), esVisible('contacto') && !errors.contacto && !apellidoFaltante && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.apellido1" @blur="tocar('contacto')" placeholder="Primer apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('contacto') && (!!errors.contacto || apellidoFaltante), esVisible('contacto') && !errors.contacto && !apellidoFaltante && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
        <input v-model="contacto.apellido2" @blur="tocar('contacto')" placeholder="Segundo apellido" class="w-full h-10 px-4 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all" :class="fieldStateClass(esVisible('contacto') && (!!errors.contacto || apellidoFaltante), esVisible('contacto') && !errors.contacto && !apellidoFaltante && !!draft.contacto, 'border-slate-200 focus:border-[#2447F9]')" />
      </div>
      <FieldError :message="esVisible('contacto') ? (apellidoFaltante ? 'Falta el apellido: mínimo un nombre y un apellido' : errors.contacto) : undefined" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
        <input v-model="draft.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Seguimiento</label>
        <input v-model="draft.seguimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
      <select v-model="draft.responsable" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar</option>
        <option value="María García">María García</option>
        <option value="Juan López">Juan López</option>
        <option value="Carlos Torres">Carlos Torres</option>
      </select>
    </div>
  </div>
</template>
