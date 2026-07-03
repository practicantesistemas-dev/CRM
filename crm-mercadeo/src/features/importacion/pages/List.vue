<script setup lang="ts">
import { Download } from 'lucide-vue-next'
import { useImportacion } from '../composables/useImportacion'
import DropZoneArchivo from '../components/DropZoneArchivo.vue'
import ResultadoImportacionPanel from '../components/ResultadoImportacionPanel.vue'
import HistorialImportacionesTable from '../tables/HistorialImportacionesTable.vue'

const {
  historial, archivoSeleccionado, procesando, resultadoVisible, resultadoMock, tipoImportacion,
  seleccionarArchivo, procesarArchivo, limpiar,
} = useImportacion()

const downloadPlantilla = (tipo: string) => {
  alert(`Descargando plantilla ${tipo}...`)
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A]">Importación Masiva</h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Carga contactos, empresas o proveedores desde Excel o CSV</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="downloadPlantilla('Contactos')" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Plantilla Excel
        </button>
        <button @click="downloadPlantilla('CSV')" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Plantilla CSV
        </button>
      </div>
    </div>

    <DropZoneArchivo
      v-model:tipo="tipoImportacion"
      :archivo-seleccionado="archivoSeleccionado"
      :procesando="procesando"
      @seleccionar="seleccionarArchivo"
      @procesar="procesarArchivo"
      @limpiar="limpiar"
    />

    <ResultadoImportacionPanel v-if="resultadoVisible" :resultado="resultadoMock" />

    <div>
      <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Historial de importaciones</h3>
      <HistorialImportacionesTable :rows="historial" />
    </div>
  </div>
</template>
