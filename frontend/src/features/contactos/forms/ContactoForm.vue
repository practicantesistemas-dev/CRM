<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Select from 'primevue/select'
import { User, Mail, Phone, Building2, Briefcase, Tag, X, Loader2, Plus, AlertCircle } from 'lucide-vue-next'
import type { ContactoDraft, Etiqueta, EtiquetaDraft } from '../types/contacto'
import { TIPO_CONTACTO_OPTIONS } from '../constants/contactos.constants'
import { contactoSchema } from '../schemas/contacto.schema'
import { useZodForm } from '@/shared/composables/useZodForm'
import { useNombreCompuesto } from '@/shared/composables/useNombreCompuesto'
import { faltaApellido } from '@/shared/utils/nombreCompuesto'
import { fieldStateClass } from '@/shared/utils/fieldStateClass'
import { useUbicaciones } from '@/shared/composables/useUbicaciones'
import FieldError from '@/shared/components/FieldError.vue'
import FechaInput from '@/shared/components/FechaInput.vue'

const props = defineProps<{
  etiquetas: Etiqueta[]
  cargandoEtiquetas?: boolean
  creandoEtiqueta?: boolean
  errorCrearEtiqueta?: string | null
  crearEtiqueta: (data: EtiquetaDraft) => Promise<Etiqueta | null>
}>()

const draft = defineModel<ContactoDraft>({ required: true })
const emit = defineEmits<{ validSubmit: [] }>()

const { errors, tocar, esVisible, onValidSubmit } = useZodForm(contactoSchema, draft)
const nombre = useNombreCompuesto(draft, 'nombre')
const apellidoFaltante = computed(() => faltaApellido(nombre))

const { departamentos, municipios, cargandoUbicaciones, municipiosDeDepartamento } = useUbicaciones()
const municipiosDisponibles = computed(() => draft.value.departamento ? municipiosDeDepartamento(draft.value.departamento) : [])
// Si cambia el departamento, la ciudad elegida deja de ser válida a menos que pertenezca al nuevo
// (mismo criterio que TitularForm.vue). Con el catálogo aún sin cargar no se puede saber si
// pertenece, así que no se toca para no borrar la ciudad de un contacto que se está editando.
watch(() => draft.value.departamento, (nuevo, anterior) => {
  if (nuevo === anterior || !draft.value.ciudad || municipios.value.length === 0) return
  if (!municipiosDeDepartamento(nuevo).some(m => m.codigo === draft.value.ciudad)) draft.value.ciudad = ''
})

defineExpose({ submit: onValidSubmit(() => { if (!apellidoFaltante.value) emit('validSubmit') }) })

// ─── Etiquetas: opcional, se eligen de las que ya existen o se crea una nueva ───────────
const estaSeleccionada = (e: Etiqueta) => draft.value.etiquetas.some(t => t.id === e.id)
const toggleEtiqueta = (e: Etiqueta) => {
  draft.value.etiquetas = estaSeleccionada(e)
    ? draft.value.etiquetas.filter(t => t.id !== e.id)
    : [...draft.value.etiquetas, e]
}
const quitarEtiqueta = (e: Etiqueta) => {
  draft.value.etiquetas = draft.value.etiquetas.filter(t => t.id !== e.id)
}

const mostrarNuevaEtiqueta = ref(false)
const nuevaEtiquetaNombre = ref('')
const nuevaEtiquetaColor = ref('#2447F9')

const crearYSeleccionarEtiqueta = async () => {
  const nombreTag = nuevaEtiquetaNombre.value.trim()
  if (!nombreTag) return
  const creada = await props.crearEtiqueta({ nombre: nombreTag, color: nuevaEtiquetaColor.value })
  if (!creada) return
  draft.value.etiquetas = [...draft.value.etiquetas, creada]
  nuevaEtiquetaNombre.value = ''
  mostrarNuevaEtiqueta.value = false
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
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo electrónico</label>
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
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Departamento *</label>
      <Select v-model="draft.departamento" @change="tocar('departamento')" :options="departamentos" option-label="nombre" option-value="codigo"
        filter filter-placeholder="Buscar departamento..." :loading="cargandoUbicaciones" placeholder="Selecciona un departamento"
        empty-filter-message="Sin resultados" empty-message="Sin departamentos" class="w-full" input-class="h-10 text-[12px] flex items-center"
        :class="fieldStateClass(esVisible('departamento') && !!errors.departamento, esVisible('departamento') && !errors.departamento && !!draft.departamento, '')" />
      <FieldError :message="esVisible('departamento') ? errors.departamento : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Ciudad *</label>
      <Select v-model="draft.ciudad" @change="tocar('ciudad')" :options="municipiosDisponibles" option-label="nombre" option-value="codigo"
        filter filter-placeholder="Buscar municipio..." :disabled="!draft.departamento" :loading="cargandoUbicaciones"
        :placeholder="draft.departamento ? 'Selecciona un municipio' : 'Elige primero un departamento'"
        empty-filter-message="Sin resultados" empty-message="Sin municipios" class="w-full" input-class="h-10 text-[12px] flex items-center"
        :class="fieldStateClass(esVisible('ciudad') && !!errors.ciudad, esVisible('ciudad') && !errors.ciudad && !!draft.ciudad, '')" />
      <FieldError :message="esVisible('ciudad') ? errors.ciudad : undefined" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Tipo de contacto</label>
      <select v-model="draft.tipoContacto" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option v-for="t in TIPO_CONTACTO_OPTIONS" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
      <FechaInput v-model="draft.fechaNacimiento" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Sexo biológico</label>
      <select v-model="draft.sexo" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Indefinido</option>
        <option value="Masculino">Masculino</option>
        <option value="Femenino">Femenino</option>
      </select>
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etiquetas <span class="font-normal normal-case text-slate-400">(opcional)</span></label>

      <!-- Seleccionadas -->
      <div v-if="draft.etiquetas.length" class="flex gap-2 mb-2 flex-wrap">
        <span v-for="tag in draft.etiquetas" :key="tag.id" class="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-50 border border-slate-200" :style="{ color: tag.color }">
          {{ tag.nombre }}<button type="button" @click="quitarEtiqueta(tag)" class="hover:opacity-70"><X :size="9" /></button>
        </span>
      </div>

      <!-- Catálogo existente: clic para seleccionar/quitar -->
      <div v-if="cargandoEtiquetas" class="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2"><Loader2 :size="12" class="animate-spin" />Cargando etiquetas...</div>
      <div v-else-if="etiquetas.length" class="flex gap-1.5 flex-wrap mb-2">
        <button
          v-for="e in etiquetas" :key="e.id" type="button" @click="toggleEtiqueta(e)"
          class="text-[10px] font-semibold px-2 py-1 rounded-full border transition-all"
          :style="estaSeleccionada(e) ? { backgroundColor: e.color, borderColor: e.color, color: '#fff' } : { color: e.color, borderColor: e.color }"
        >{{ e.nombre }}</button>
      </div>

      <!-- Crear una nueva etiqueta -->
      <button v-if="!mostrarNuevaEtiqueta" type="button" @click="mostrarNuevaEtiqueta = true"
        class="flex items-center gap-1 h-8 px-3 rounded-lg border border-dashed border-slate-300 bg-white text-[11px] font-semibold text-slate-500 hover:border-[#2447F9] hover:text-[#2447F9] transition-all">
        <Plus :size="11" /> Nueva etiqueta
      </button>
      <div v-else class="flex items-center gap-2">
        <div class="relative flex-1"><Tag :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="nuevaEtiquetaNombre" placeholder="Nombre de la etiqueta" @keydown.enter.prevent="crearYSeleccionarEtiqueta"
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" /></div>
        <input v-model="nuevaEtiquetaColor" type="color" title="Color de la etiqueta" class="h-9 w-9 rounded-lg border border-slate-200 cursor-pointer" />
        <button type="button" @click="crearYSeleccionarEtiqueta" :disabled="creandoEtiqueta || !nuevaEtiquetaNombre.trim()"
          class="flex items-center gap-1 h-9 px-3 rounded-lg bg-[#2447F9] text-white text-[11px] font-semibold hover:bg-[#1D3DD9] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="creandoEtiqueta" :size="12" class="animate-spin" />Crear
        </button>
        <button type="button" @click="mostrarNuevaEtiqueta = false; nuevaEtiquetaNombre = ''" class="h-9 px-2 rounded-lg text-slate-400 hover:text-slate-600"><X :size="14" /></button>
      </div>
      <p v-if="errorCrearEtiqueta" class="flex items-center gap-1.5 text-[11px] text-red-600 font-medium mt-2"><AlertCircle :size="12" />{{ errorCrearEtiqueta }}</p>
    </div>
  </div>
</template>
