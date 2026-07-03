<script setup lang="ts">
import { ref } from 'vue'
import { Download, Save } from 'lucide-vue-next'
import { useSegmentacion } from '../composables/useSegmentacion'
import FiltrosSegmentacion from '../forms/FiltrosSegmentacion.vue'
import GuardarSegmentoPanel from '../components/GuardarSegmentoPanel.vue'
import SegmentoCard from '../components/SegmentoCard.vue'

const {
  segmentosGuardados, filtros, filtrosActivos, resultadoMock,
  limpiar, guardarSegmento, duplicar, eliminar, cargarSegmento,
} = useSegmentacion()

const nombreSegmento = ref('')
const mostrarGuardar = ref(false)

const confirmarGuardado = () => {
  if (!nombreSegmento.value) return
  guardarSegmento(nombreSegmento.value)
  nombreSegmento.value = ''
  mostrarGuardar.value = false
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A]">Segmentación</h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Filtra, guarda y exporta segmentos de contactos</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="mostrarGuardar = true" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Save :size="13" /> Guardar segmento
        </button>
      </div>
    </div>

    <FiltrosSegmentacion
      v-model:filtros="filtros"
      :filtros-activos="filtrosActivos"
      :resultado="resultadoMock"
      @limpiar="limpiar"
    />

    <GuardarSegmentoPanel
      v-if="mostrarGuardar"
      v-model:nombre="nombreSegmento"
      @guardar="confirmarGuardado"
      @cancelar="mostrarGuardar = false"
    />

    <div>
      <h3 class="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-3">Segmentos guardados ({{ segmentosGuardados.length }})</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <SegmentoCard
          v-for="s in segmentosGuardados"
          :key="s.id"
          :segmento="s"
          @duplicar="duplicar(s)"
          @eliminar="eliminar(s.id)"
          @cargar="cargarSegmento(s)"
        />
      </div>
    </div>
  </div>
</template>
