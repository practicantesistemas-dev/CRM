<script setup lang="ts">
import { X, Upload, Download, FileSpreadsheet, Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { OPCIONES_IMPORT } from '../constants/plan-liga.constants'
import { useImportacionPlanLiga } from '../composables/useImportacionPlanLiga'

const emit = defineEmits<{ cerrar: [] }>()
const visible = defineModel<boolean>('visible', { required: true })

const {
  tipoImport, archivoNombre, procesandoImport, resultadoImport, dragOverImport,
  seleccionarTipo, onDragOverImport, onDragLeaveImport, onDropImport, onFileInput,
  procesarImport, resetImport, descargarPlantilla,
} = useImportacionPlanLiga()

const fileRef = ref<HTMLInputElement | null>(null)

const cerrar = () => {
  visible.value = false
  resetImport()
  emit('cerrar')
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="cerrar">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A] flex items-center gap-2"><Upload :size="15" class="text-[#EC4899]" />Importación masiva · Plan Liga</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Selecciona el tipo de operación y sube el archivo</p>
        </div>
        <button @click="cerrar" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>

      <div class="overflow-y-auto flex-1 p-6 space-y-5">
        <div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-3">1. Tipo de operación</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button v-for="op in OPCIONES_IMPORT" :key="op.key"
              @click="seleccionarTipo(op.key)"
              class="flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all"
              :class="tipoImport === op.key ? 'shadow-sm' : 'border-slate-200 hover:border-slate-300'"
              :style="tipoImport === op.key ? { borderColor: op.color, backgroundColor: op.bg } : {}">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" :style="{ backgroundColor: tipoImport === op.key ? op.color : '#F1F5F9' }">
                <FileSpreadsheet :size="15" :style="{ color: tipoImport === op.key ? 'white' : '#94A3B8' }" />
              </div>
              <div class="min-w-0">
                <div class="text-[11px] font-bold" :style="{ color: tipoImport === op.key ? op.color : '#0F172A' }">{{ op.label }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5 leading-tight">{{ op.desc }}</div>
              </div>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3">
          <div>
            <p class="text-[11px] font-bold text-slate-700">Plantilla: {{ OPCIONES_IMPORT.find(o => o.key === tipoImport)?.label }}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">Descarga el formato correcto para esta operación</p>
          </div>
          <button @click="descargarPlantilla" class="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all shrink-0">
            <Download :size="12" /> Descargar
          </button>
        </div>

        <div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-3">2. Subir archivo</p>
          <div class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
            :class="dragOverImport ? 'border-[#EC4899] bg-[#FCE7F3]' : 'border-slate-300 hover:border-slate-400 bg-slate-50'"
            @dragover="onDragOverImport" @dragleave="onDragLeaveImport" @drop="onDropImport"
            @click="fileRef?.click()">
            <input ref="fileRef" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="onFileInput" />
            <FileSpreadsheet :size="28" class="mx-auto mb-2" :class="archivoNombre ? 'text-[#EC4899]' : 'text-slate-400'" />
            <p class="text-[12px] font-semibold text-slate-600">{{ archivoNombre || 'Arrastra aquí o haz clic para seleccionar' }}</p>
            <p v-if="!archivoNombre" class="text-[10px] text-slate-400 mt-1">Formatos: .xlsx, .xls, .csv · Máx. 5 MB</p>
            <p v-else class="text-[10px] text-[#EC4899] mt-1 font-medium">Archivo listo para procesar</p>
          </div>
        </div>

        <div v-if="resultadoImport" class="grid grid-cols-3 gap-3">
          <div class="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
            <div class="text-[24px] font-bold text-[#0F172A]">{{ resultadoImport.total }}</div>
            <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Total filas</div>
          </div>
          <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <div class="text-[24px] font-bold text-emerald-700">{{ resultadoImport.exitosos }}</div>
            <div class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide mt-1">Procesados</div>
          </div>
          <div class="bg-red-50 rounded-xl p-4 text-center border border-red-200">
            <div class="text-[24px] font-bold text-red-600">{{ resultadoImport.errores }}</div>
            <div class="text-[10px] font-semibold text-red-500 uppercase tracking-wide mt-1">Con errores</div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button @click="cerrar" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cerrar</button>
        <button @click="procesarImport" :disabled="!archivoNombre || procesandoImport"
          class="flex items-center gap-1.5 h-9 px-6 rounded-lg text-[11px] font-bold shadow transition-all"
          :class="archivoNombre && !procesandoImport ? 'bg-[#EC4899] text-white hover:bg-[#D61F69]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'">
          <Loader2 v-if="procesandoImport" :size="13" class="animate-spin" />
          <Upload v-else :size="13" />
          {{ procesandoImport ? 'Procesando...' : 'Procesar archivo' }}
        </button>
      </div>
    </div>
  </div>
</template>
