<script setup lang="ts">
import { onMounted } from 'vue'
import { Download, Loader2, X } from 'lucide-vue-next'
import { useImportacion } from '../composables/useImportacion'
import DropZoneArchivo from '../components/DropZoneArchivo.vue'
import ResultadoImportacionPanel from '../components/ResultadoImportacionPanel.vue'
import HistorialImportacionesTable from '../tables/HistorialImportacionesTable.vue'
import FechaInput from '@/shared/components/FechaInput.vue'

const {
  historial, cargandoHistorial, errorHistorial, cargarHistorial,
  filtroFechaDesde, filtroFechaHasta, historialFiltrado,
  paginaHistorial, historialPaginado, totalPaginasHistorial,
  archivoSeleccionado, procesando, resultadoVisible, resultado, tipoImportacion, progreso, errorProceso,
  seleccionarArchivo, procesarArchivo, limpiar,
  descargarPlantillaActual, descargarReporteActual, descargarErroresDeRegistro,
} = useImportacion()

onMounted(cargarHistorial)

// Una importación no puede tener fecha futura, así que "Hasta" (y "Desde" cuando "Hasta" está
// vacío) no debe dejar elegir más allá de hoy.
const hoy = new Date().toISOString().split('T')[0]
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-heading">Importación Masiva</h2>
        <p class="text-[12px] text-body mt-0.5">Carga contactos, empresas o proveedores desde Excel</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="descargarPlantillaActual" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
          <Download :size="13" /> Plantilla de {{ tipoImportacion }}
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

    <div v-if="procesando && progreso.total > 0" class="surface-card rounded-2xl shadow-sm p-4">
      <div class="flex items-center justify-between text-[11px] text-body mb-2">
        <span>Procesando registro {{ progreso.hechos }} de {{ progreso.total }}...</span>
        <span>{{ Math.round((progreso.hechos / progreso.total) * 100) }}%</span>
      </div>
      <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <div class="h-full bg-[#2447F9] transition-all" :style="{ width: `${(progreso.hechos / progreso.total) * 100}%` }" />
      </div>
    </div>

    <p v-if="errorProceso" class="text-[12px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">{{ errorProceso }}</p>

    <ResultadoImportacionPanel v-if="resultadoVisible" :resultado="resultado" @descargar-reporte="descargarReporteActual" />

    <div>
      <h3 class="text-[12px] font-bold text-subtle uppercase tracking-wider mb-3">Historial de importaciones</h3>

      <p v-if="errorHistorial" class="text-[12px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg px-3 py-2 mb-3">{{ errorHistorial }}</p>
      <div v-if="cargandoHistorial" class="flex items-center gap-2 text-[12px] text-body">
        <Loader2 :size="14" class="animate-spin" /> Cargando historial...
      </div>
      <template v-else>
        <div class="surface-card rounded-2xl shadow-sm px-4 py-3 mb-3">
          <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-semibold text-subtle shrink-0">Desde</span>
              <FechaInput v-model="filtroFechaDesde" :max="filtroFechaHasta || hoy" placeholder="Cualquiera" />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] font-semibold text-subtle shrink-0">Hasta</span>
              <FechaInput v-model="filtroFechaHasta" :min="filtroFechaDesde || undefined" :max="hoy" placeholder="Cualquiera" />
            </div>
            <button
              v-if="filtroFechaDesde || filtroFechaHasta"
              @click="filtroFechaDesde = ''; filtroFechaHasta = ''"
              class="flex items-center gap-1 h-9 px-3 rounded-lg border border-default text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shrink-0"
            >
              <X :size="12" /> Limpiar
            </button>
          </div>
          <div class="mt-2 text-[11px] text-muted">
            Mostrando <strong class="text-body">{{ historialFiltrado.length }}</strong> de <strong class="text-body">{{ historial.length }}</strong> importaciones
          </div>
        </div>
        <HistorialImportacionesTable
          :rows="historialPaginado"
          :pagina-actual="paginaHistorial"
          :total-paginas="totalPaginasHistorial"
          @update:pagina-actual="paginaHistorial = $event"
          @descargar-errores="descargarErroresDeRegistro"
        />
      </template>
    </div>
  </div>
</template>
