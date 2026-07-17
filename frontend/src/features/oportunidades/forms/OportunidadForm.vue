<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { OportunidadDraft, TipoCliente } from '../types/oportunidad'
import { ETAPAS, TIPOS_CLIENTE } from '../constants/oportunidades.constants'
import { oportunidadSchema } from '../schemas/oportunidad.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import FieldError from '@/shared/components/FieldError.vue'
import BuscadorEntidad, { type OpcionBuscador } from '@/shared/components/BuscadorEntidad.vue'
import { getEmpresas } from '@/features/empresas/services/empresas.api'
import { getContactos } from '@/features/contactos/services/contactos.api'
import { getTitulares } from '@/features/plan-liga/services/plan-liga.api'
import type { Titular } from '@/features/plan-liga/types/plan-liga'

const draft = defineModel<OportunidadDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(oportunidadSchema, draft)
defineExpose({ submit: onValidSubmit(() => emit('validSubmit')) })

const opcionesEmpresas = computed<OpcionBuscador[]>(() =>
  getEmpresas().map(e => ({ id: e.id, label: e.razonSocial, sublabel: e.ciudad })),
)

const opcionesContactos = computed<OpcionBuscador[]>(() =>
  getContactos().map(c => ({ id: c.id, label: c.nombre, sublabel: c.empresa })),
)

const opcionesContactosDeEmpresa = computed<OpcionBuscador[]>(() => {
  const empresa = opcionesEmpresas.value.find(e => e.id === draft.value.empresaId)
  if (!empresa) return []
  return getContactos()
    .filter(c => c.empresa === empresa.label)
    .map(c => ({ id: c.id, label: c.nombre, sublabel: c.cargo }))
})

const titulares = ref<Titular[]>([])
onMounted(async () => { titulares.value = await getTitulares() })

const opcionesTitulares = computed<OpcionBuscador[]>(() =>
  titulares.value.map(t => ({ id: t.id, label: t.nombre, sublabel: t.empresa })),
)

function cambiarTipoCliente(tipo: TipoCliente) {
  if (draft.value.tipoCliente === tipo) return
  draft.value.tipoCliente = tipo
  draft.value.empresaId = null
  draft.value.empresaNombre = ''
  draft.value.contactoId = null
  draft.value.contactoNombre = ''
  draft.value.planLigaTitularId = null
  draft.value.titularNombre = ''
}

function alSeleccionarEmpresa(item: OpcionBuscador | null) {
  draft.value.empresaNombre = item?.label ?? ''
  draft.value.contactoId = null
  draft.value.contactoNombre = ''
}

function alSeleccionarContacto(item: OpcionBuscador | null) {
  draft.value.contactoNombre = item?.label ?? ''
}

function alSeleccionarTitular(item: OpcionBuscador | null) {
  draft.value.titularNombre = item?.label ?? ''
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de cliente *</label>
      <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
        <button
          v-for="t in TIPOS_CLIENTE" :key="t.value" type="button"
          @click="cambiarTipoCliente(t.value)"
          class="h-9 rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
          :class="draft.tipoCliente === t.value ? 'bg-white text-[#2447F9] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          <component :is="t.icono" :size="13" />
          <span class="truncate">{{ t.label }}</span>
        </button>
      </div>
    </div>

    <template v-if="draft.tipoCliente === 'empresa'">
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
        <BuscadorEntidad
          v-model="draft.empresaId"
          :opciones="opcionesEmpresas"
          placeholder="Buscar empresa..."
          vacio="No se encontraron empresas"
          @select="alSeleccionarEmpresa"
          @blur="tocar('empresaId')"
        />
        <FieldError :message="esVisible('empresaId') ? errors.empresaId : undefined" />
      </div>
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto (opcional)</label>
        <BuscadorEntidad
          v-model="draft.contactoId"
          :opciones="opcionesContactosDeEmpresa"
          :disabled="!draft.empresaId"
          placeholder="Buscar contacto de la empresa..."
          vacio="Esta empresa no tiene contactos registrados"
          @select="alSeleccionarContacto"
        />
      </div>
    </template>

    <template v-else-if="draft.tipoCliente === 'contacto'">
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto *</label>
        <BuscadorEntidad
          v-model="draft.contactoId"
          :opciones="opcionesContactos"
          placeholder="Buscar contacto..."
          vacio="No se encontraron contactos"
          @select="alSeleccionarContacto"
          @blur="tocar('contactoId')"
        />
        <FieldError :message="esVisible('contactoId') ? errors.contactoId : undefined" />
      </div>
    </template>

    <template v-else-if="draft.tipoCliente === 'titular'">
      <div class="sm:col-span-2">
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Titular Plan Liga *</label>
        <BuscadorEntidad
          v-model="draft.planLigaTitularId"
          :opciones="opcionesTitulares"
          placeholder="Buscar titular Plan Liga..."
          vacio="No se encontraron titulares"
          @select="alSeleccionarTitular"
          @blur="tocar('planLigaTitularId')"
        />
        <FieldError :message="esVisible('planLigaTitularId') ? errors.planLigaTitularId : undefined" />
      </div>
    </template>

    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Servicio *</label>
      <select v-model="draft.servicio" @blur="tocar('servicio')" class="w-full h-10 px-3 rounded-lg border bg-slate-50 text-[12px] outline-none focus:bg-white transition-all cursor-pointer" :class="fieldStateClass(esVisible('servicio') && !!errors.servicio, esVisible('servicio') && !errors.servicio && !!draft.servicio, 'border-slate-200 focus:border-[#2447F9]')">
        <option value="">Seleccionar servicio</option>
        <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
        <option value="Plan Liga Individual">Plan Liga Individual</option>
        <option value="Tamizajes">Tamizajes</option>
        <option value="Brigadas de Salud">Brigadas de Salud</option>
        <option value="Capacitaciones">Capacitaciones</option>
        <option value="Programas de Bienestar">Programas de Bienestar</option>
      </select>
      <FieldError :message="esVisible('servicio') ? errors.servicio : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
      <input v-model="draft.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Probabilidad ({{ draft.probabilidad }}%)</label>
      <input v-model.number="draft.probabilidad" type="range" min="0" max="100" step="5" class="w-full h-2 rounded-lg appearance-none cursor-pointer mt-3" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etapa</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option v-for="e in ETAPAS" :key="e" :value="e">{{ e }}</option>
      </select>
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
