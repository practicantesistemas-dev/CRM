<script setup lang="ts">
import { computed } from 'vue'
import type { ActividadDraft } from '../types/actividad'
import { TIPOS_ACTIVIDAD, TIPO_META } from '../constants/relacionamiento.constants'
import { actividadSchema } from '../schemas/actividad.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'
import BuscadorEntidad, { type OpcionBuscador } from '@/shared/components/BuscadorEntidad.vue'
import { getOportunidades } from '@/features/oportunidades/services/oportunidades.api'
import { clienteLabel } from '@/features/oportunidades/constants/oportunidades.constants'
import { getContactos } from '@/features/contactos/services/contactos.api'
import { getEmpresas } from '@/features/empresas/services/empresas.api'
import { getTitulares } from '@/features/plan-liga/services/plan-liga.api'

const draft = defineModel<ActividadDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(actividadSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const opcionesContactos = computed<OpcionBuscador[]>(() =>
  getContactos().map(c => ({ id: c.id, label: c.nombre, sublabel: c.empresa })),
)
const opcionesEmpresas = computed<OpcionBuscador[]>(() =>
  getEmpresas().map(e => ({ id: e.id, label: e.razonSocial, sublabel: e.ciudad })),
)
const opcionesTitulares = computed<OpcionBuscador[]>(() =>
  getTitulares().map(t => ({ id: t.id, label: t.nombre, sublabel: t.empresa })),
)

function alSeleccionarContacto(item: OpcionBuscador | null) {
  draft.value.contactoNombre = item?.label ?? ''
}
function alSeleccionarEmpresa(item: OpcionBuscador | null) {
  draft.value.empresaNombre = item?.label ?? ''
}
function alSeleccionarTitular(item: OpcionBuscador | null) {
  draft.value.titularNombre = item?.label ?? ''
}

const errorSujeto = computed(() =>
  (esVisible('contactoId') && errors.value.contactoId)
  || (esVisible('empresaId') && errors.value.empresaId)
  || (esVisible('titularId') && errors.value.titularId)
  || undefined,
)

const opcionesOportunidades = computed<OpcionBuscador[]>(() => {
  const { contactoId, empresaId, titularId } = draft.value
  const todas = getOportunidades()
  const relevantes = (contactoId || empresaId || titularId)
    ? todas.filter(o => (contactoId && o.contactoId === contactoId) || (empresaId && o.empresaId === empresaId) || (titularId && o.planLigaTitularId === titularId))
    : todas
  return relevantes.map(o => ({ id: o.id, label: o.servicio, sublabel: `${clienteLabel(o)} · ${o.estado}` }))
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="tipo in TIPOS_ACTIVIDAD" :key="tipo"
          @click="draft.tipo = tipo"
          class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold border transition-all"
          :class="draft.tipo === tipo ? 'text-white border-transparent shadow' : 'bg-white border-slate-200 text-slate-500'"
          :style="draft.tipo === tipo ? { backgroundColor: TIPO_META[tipo].color } : {}"
        >
          <component :is="TIPO_META[tipo].icono" :size="11" /> {{ tipo }}
        </button>
      </div>
    </div>

    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto, empresa o titular Plan Liga (selecciona al menos uno) *</label>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <BuscadorEntidad
          v-model="draft.contactoId"
          :opciones="opcionesContactos"
          placeholder="Buscar contacto..."
          vacio="No se encontraron contactos"
          @select="alSeleccionarContacto"
          @blur="tocar('contactoId')"
        />
        <BuscadorEntidad
          v-model="draft.empresaId"
          :opciones="opcionesEmpresas"
          placeholder="Buscar empresa..."
          vacio="No se encontraron empresas"
          @select="alSeleccionarEmpresa"
          @blur="tocar('empresaId')"
        />
        <BuscadorEntidad
          v-model="draft.titularId"
          :opciones="opcionesTitulares"
          placeholder="Buscar titular Plan Liga..."
          vacio="No se encontraron titulares"
          @select="alSeleccionarTitular"
          @blur="tocar('titularId')"
        />
      </div>
      <FieldError :message="errorSujeto" />
    </div>

    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Acción realizada *</label>
      <textarea v-model="draft.accion" @blur="tocar('accion')" placeholder="Describa la actividad realizada..." rows="3" class="w-full px-4 py-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all resize-none" :class="fieldStateClass(esVisible('accion') && !!errors.accion, esVisible('accion') && !errors.accion && !!draft.accion, 'border-slate-200 focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('accion') ? errors.accion : undefined" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
      <input v-model="draft.proximoPaso" placeholder="¿Cuál es el siguiente paso?" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
      <input v-model="draft.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Usuario *</label>
      <select v-model="draft.usuario" @blur="tocar('usuario')" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(esVisible('usuario') && !!errors.usuario, esVisible('usuario') && !errors.usuario && !!draft.usuario, 'border-slate-200 focus:border-[#2447F9]')">
        <option value="">Seleccionar</option>
        <option value="María García">María García</option>
        <option value="Juan López">Juan López</option>
        <option value="Carlos Torres">Carlos Torres</option>
      </select>
      <FieldError :message="esVisible('usuario') ? errors.usuario : undefined" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Oportunidad relacionada (opcional)</label>
      <BuscadorEntidad
        v-model="draft.oportunidadId"
        :opciones="opcionesOportunidades"
        placeholder="Buscar oportunidad..."
        vacio="No hay oportunidades registradas"
      />
    </div>
  </div>
</template>
