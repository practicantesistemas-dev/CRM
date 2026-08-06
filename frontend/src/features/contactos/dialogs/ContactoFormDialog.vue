<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { X, Loader2, AlertCircle } from 'lucide-vue-next'
import type { ContactoDraft, Etiqueta, EtiquetaDraft } from '../types/contacto'
import type { Empresa } from '@/features/empresas/types/empresa'
import ContactoForm from '../forms/ContactoForm.vue'

const props = defineProps<{
  modo: 'nuevo' | 'editar'
  guardando?: boolean
  error?: string | null
  etiquetas: Etiqueta[]
  cargandoEtiquetas?: boolean
  creandoEtiqueta?: boolean
  errorCrearEtiqueta?: string | null
  // Función (no evento) porque el formulario necesita el Etiqueta recién creado de vuelta
  // para seleccionarlo automáticamente; un emit no puede devolver el resultado del await.
  crearEtiqueta: (data: EtiquetaDraft) => Promise<Etiqueta | null>
  empresas: Empresa[]
  cargandoEmpresas?: boolean
}>()
const emit = defineEmits<{ submit: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
const draft = defineModel<ContactoDraft>('draft', { required: true })

const formRef = ref<InstanceType<typeof ContactoForm>>()
const contenidoRef = ref<HTMLDivElement>()

// El formulario es largo y el error de guardado se muestra arriba del todo: si el usuario
// está con el scroll más abajo (llenando etiquetas, por ejemplo) al hacer clic en "Crear
// contacto", el rechazo del backend queda fuera de vista y parece que "no pasó nada".
watch(() => props.error, (nuevo) => {
  if (nuevo) nextTick(() => contenidoRef.value?.scrollTo({ top: 0, behavior: 'smooth' }))
})
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">{{ modo === 'nuevo' ? 'Nuevo Contacto' : 'Editar Contacto' }}</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Complete todos los campos requeridos</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div ref="contenidoRef" class="overflow-y-auto flex-1 p-6">
        <div v-if="error" class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          <AlertCircle :size="13" class="text-red-500 shrink-0" />
          <p class="text-[11px] text-red-600 font-medium">{{ error }}</p>
        </div>
        <ContactoForm
          ref="formRef"
          v-model="draft"
          :etiquetas="etiquetas"
          :cargando-etiquetas="cargandoEtiquetas"
          :creando-etiqueta="creandoEtiqueta"
          :error-crear-etiqueta="errorCrearEtiqueta"
          :crear-etiqueta="crearEtiqueta"
          :empresas="empresas"
          :cargando-empresas="cargandoEmpresas"
          @valid-submit="emit('submit')"
        />
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="visible = false" :disabled="guardando" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all">Cancelar</button>
        <button @click="formRef?.submit()" :disabled="guardando"
          class="flex items-center justify-center gap-1.5 h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="guardando" :size="12" class="animate-spin" />
          {{ modo === 'nuevo' ? (guardando ? 'Creando...' : 'Crear contacto') : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>
