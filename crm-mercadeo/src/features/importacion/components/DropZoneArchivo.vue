<script setup lang="ts">
import { ref } from 'vue'
import { Upload, FileText, RefreshCw } from 'lucide-vue-next'
import type { TipoImportacion } from '../types/importacion'
import { TIPOS_IMPORTACION } from '../constants/importacion.constants'

defineProps<{
  archivoSeleccionado: File | null
  procesando: boolean
}>()
const emit = defineEmits<{
  seleccionar: [file: File]
  procesar: []
  limpiar: []
}>()

const tipoImportacion = defineModel<TipoImportacion>('tipo', { required: true })

const dragOver = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const onDrop = (e: DragEvent) => {
  dragOver.value = false
  const file = e.dataTransfer?.files[0]
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.csv'))) {
    emit('seleccionar', file)
  }
}

const onFileInput = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) emit('seleccionar', file)
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h3 class="text-[13px] font-bold text-[#0F172A] mb-4">Cargar archivo</h3>

    <div class="flex gap-2 mb-5">
      <button
        v-for="t in TIPOS_IMPORTACION" :key="t"
        @click="tipoImportacion = t"
        class="flex-1 h-9 rounded-xl text-[11px] font-bold transition-all capitalize"
        :class="tipoImportacion === t ? 'bg-[#2447F9] text-white shadow' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
      >
        {{ t }}
      </button>
    </div>

    <div
      class="border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer"
      :class="dragOver ? 'border-[#2447F9] bg-[#EEF2FF]' : archivoSeleccionado ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-[#2447F9] hover:bg-[#EEF2FF]/30'"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
      @click="fileInput?.click()"
    >
      <input ref="fileInput" type="file" accept=".xlsx,.csv" class="hidden" @change="onFileInput" />

      <div v-if="!archivoSeleccionado">
        <div class="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
          <Upload :size="24" class="text-[#2447F9]" />
        </div>
        <p class="text-[13px] font-bold text-[#0F172A] mb-1">Arrastra tu archivo aquí o haz clic para seleccionar</p>
        <p class="text-[11px] text-slate-400">Formatos soportados: <strong>.xlsx</strong> (Excel) · <strong>.csv</strong> · máximo 10MB</p>
      </div>

      <div v-else class="flex items-center justify-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <FileText :size="22" class="text-emerald-600" />
        </div>
        <div class="text-left">
          <p class="text-[13px] font-bold text-[#0F172A]">{{ archivoSeleccionado.name }}</p>
          <p class="text-[11px] text-slate-400">{{ (archivoSeleccionado.size / 1024).toFixed(1) }} KB · listo para procesar</p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <button v-if="archivoSeleccionado" @click="emit('limpiar')" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-500 hover:bg-slate-50 transition-all">
        <RefreshCw :size="12" /> Cambiar archivo
      </button>
      <div v-else />
      <button
        @click="emit('procesar')"
        :disabled="!archivoSeleccionado || procesando"
        class="flex items-center gap-1.5 h-9 px-6 rounded-lg text-[11px] font-bold shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        :class="archivoSeleccionado && !procesando ? 'bg-[#2447F9] text-white hover:bg-[#1D3DD9]' : 'bg-slate-200 text-slate-400'"
      >
        <RefreshCw v-if="procesando" :size="13" class="animate-spin" />
        <Upload v-else :size="13" />
        {{ procesando ? 'Procesando...' : 'Importar ahora' }}
      </button>
    </div>
  </div>
</template>
