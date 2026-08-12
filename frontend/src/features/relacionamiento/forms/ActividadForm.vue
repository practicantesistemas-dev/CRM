<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { ActividadDraft } from '../types/actividad'
import { TIPOS_ACTIVIDAD, TIPO_META } from '../constants/relacionamiento.constants'
import { actividadSchema } from '../schemas/actividad.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'
import FechaInput from '@/shared/components/FechaInput.vue'
import BuscadorEntidad, { type OpcionBuscador } from '@/shared/components/BuscadorEntidad.vue'
import { getOportunidades } from '@/features/oportunidades/services/oportunidades.api'
import { clienteLabel } from '@/features/oportunidades/constants/oportunidades.constants'
import { getContactos } from '@/features/contactos/services/contactos.api'
import type { Contacto } from '@/features/contactos/types/contacto'
import { getTitulares } from '@/features/plan-liga/services/plan-liga.api'
import type { Titular } from '@/features/plan-liga/types/plan-liga'
import { getEmpresas } from '@/features/empresas/services/empresas.api'
import type { Empresa } from '@/features/empresas/types/empresa'

const draft = defineModel<ActividadDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(actividadSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const contactos = ref<Contacto[]>([])
onMounted(async () => { contactos.value = await getContactos() })

const opcionesContactos = computed<OpcionBuscador[]>(() =>
  contactos.value.map(c => ({ id: c.id, label: c.nombre, sublabel: c.empresaNombre })),
)
const titulares = ref<Titular[]>([])
onMounted(async () => { titulares.value = await getTitulares() })

const opcionesTitulares = computed<OpcionBuscador[]>(() =>
  titulares.value.map(t => ({ id: t.id, label: t.nombre, sublabel: t.empresa })),
)

// empresaNombre sigue siendo texto libre (el backend no tiene empresa_id en la bitácora),
// pero se busca contra el catálogo real de empresas en vez de escribirla a mano: reduce
// typos y mantiene el mismo nombre exacto que usa el resto del CRM para cruzar información
// (ej. el historial de empresas filtra actividades comparando este texto con razonSocial).
const empresas = ref<Empresa[]>([])
onMounted(async () => { empresas.value = await getEmpresas() })

const opcionesEmpresas = computed<OpcionBuscador[]>(() =>
  empresas.value.map(e => ({ id: e.id, label: e.razonSocial, sublabel: e.ciudad })),
)

// Al editar una actividad ya guardada, preselecciona la empresa en el buscador si su nombre
// coincide con una del catálogo (para que no se vea vacío aunque el dato ya exista).
const empresaSeleccionadaId = ref<number | null>(null)
watch([empresas, () => draft.value.empresaNombre], ([lista, nombre]) => {
  const encontrada = nombre ? lista.find(e => e.razonSocial.trim().toLowerCase() === nombre.trim().toLowerCase()) : null
  empresaSeleccionadaId.value = encontrada?.id ?? null
}, { immediate: true })

function alSeleccionarContacto(item: OpcionBuscador | null) {
  draft.value.contactoNombre = item?.label ?? ''
}
function alSeleccionarEmpresa(item: OpcionBuscador | null) {
  draft.value.empresaNombre = item?.label ?? ''
}
// nombre_empresa ya no depende de un catálogo (no es FK): al elegir un titular Plan Liga
// se toma su empresa tal cual, sin obligar a buscarla/escribirla de nuevo.
function alSeleccionarTitular(item: OpcionBuscador | null) {
  draft.value.titularNombre = item?.label ?? ''
  if (item) draft.value.empresaNombre = titulares.value.find(t => t.id === item.id)?.empresa ?? draft.value.empresaNombre
}

const errorSujeto = computed(() =>
  (esVisible('contactoId') && errors.value.contactoId)
  || (esVisible('empresaNombre') && errors.value.empresaNombre)
  || (esVisible('titularId') && errors.value.titularId)
  || undefined,
)

const opcionesOportunidades = computed<OpcionBuscador[]>(() => {
  const { contactoId, titularId } = draft.value
  const todas = getOportunidades()
  const relevantes = (contactoId || titularId)
    ? todas.filter(o => (contactoId && o.contactoId === contactoId) || (titularId && o.planLigaTitularId === titularId))
    : todas
  return relevantes.map(o => ({ id: o.id, label: o.servicio, sublabel: `${clienteLabel(o)} · ${o.estado}` }))
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-2 uppercase tracking-wide">Tipo de actividad</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="tipo in TIPOS_ACTIVIDAD" :key="tipo"
          @click="draft.tipo = tipo"
          class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold border transition-all"
          :class="draft.tipo === tipo ? 'text-white border-transparent shadow' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'"
          :style="draft.tipo === tipo ? { backgroundColor: TIPO_META[tipo].color } : {}"
        >
          <component :is="TIPO_META[tipo].icono" :size="11" /> {{ tipo }}
        </button>
      </div>
    </div>

    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Contacto, empresa o titular Plan Liga (selecciona al menos uno) *</label>
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
          v-model="empresaSeleccionadaId"
          :opciones="opcionesEmpresas"
          placeholder="Buscar empresa..."
          vacio="No se encontraron empresas"
          @select="alSeleccionarEmpresa"
          @blur="tocar('empresaNombre')"
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
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Acción realizada *</label>
      <textarea v-model="draft.accion" @blur="tocar('accion')" placeholder="Describa la actividad realizada..." rows="3" class="w-full px-4 py-3 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-[12px] outline-none focus:bg-white dark:focus:bg-slate-800 transition-all resize-none" :class="fieldStateClass(esVisible('accion') && !!errors.accion, esVisible('accion') && !errors.accion && !!draft.accion, 'border-slate-200 dark:border-slate-600 focus:border-[#2447F9] dark:focus:border-[#2447F9]')" />
      <FieldError :message="esVisible('accion') ? errors.accion : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Próximo paso</label>
      <input v-model="draft.proximoPaso" @blur="tocar('proximoPaso')" placeholder="¿Cuál es el siguiente paso?" class="w-full h-10 px-4 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] dark:focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all" />
      <FieldError :message="esVisible('proximoPaso') ? errors.proximoPaso : undefined" />
    </div>
    <div v-if="draft.proximoPaso">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Fecha límite del próximo paso</label>
      <FechaInput v-model="draft.proximoPasoFecha" placeholder="Opcional" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Fecha de creación</label>
      <FechaInput v-model="draft.fecha" disabled />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-body mb-1.5 uppercase tracking-wide">Oportunidad relacionada (opcional)</label>
      <BuscadorEntidad
        v-model="draft.oportunidadId"
        :opciones="opcionesOportunidades"
        placeholder="Buscar oportunidad..."
        vacio="No hay oportunidades registradas"
      />
    </div>
  </div>
</template>
