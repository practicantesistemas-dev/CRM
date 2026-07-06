<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ZoomIn, ZoomOut } from 'lucide-vue-next'
import type { TarjetaDraft } from '../types/tarjeta'
import { ETAPAS, ETAPA_COLOR, TARJETA_DRAFT_VACIO } from '../constants/embudos.constants'
import { useEmbudos } from '../composables/useEmbudos'
import KanbanColumn from '../components/KanbanColumn.vue'
import NuevaTarjetaDialog from '../dialogs/NuevaTarjetaDialog.vue'

const {
  draggingId, dropTarget, dropIndicator,
  onDragStart, onDragEnd, onDragOver, onDragOverCard, onDragLeave, onDrop,
  porEtapa, valorEtapa, totalOportunidades, totalValor,
  crearTarjeta,
} = useEmbudos()

const nuevaVisible = ref(false)
const draft = ref<TarjetaDraft>({ ...TARJETA_DRAFT_VACIO })

const abrirNueva = (etapa: string) => {
  draft.value = { ...TARJETA_DRAFT_VACIO, etapa }
  nuevaVisible.value = true
}

const confirmarCreacion = () => {
  crearTarjeta(draft.value)
  nuevaVisible.value = false
}

const ZOOM_MIN = 0.5
const ZOOM_MAX = 1.5
const ZOOM_STEP = 0.1
const zoom = ref(1)

const zoomIn = () => { zoom.value = Math.min(ZOOM_MAX, +(zoom.value + ZOOM_STEP).toFixed(2)) }
const zoomOut = () => { zoom.value = Math.max(ZOOM_MIN, +(zoom.value - ZOOM_STEP).toFixed(2)) }
const resetZoom = () => { zoom.value = 1 }
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Tablero
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ totalOportunidades }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">
          Pipeline Kanban · arrastra las tarjetas para cambiar etapa · valor total:
          <strong class="text-[#0F172A]">{{ totalValor }}</strong>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-0.5 border border-slate-200 rounded-lg p-1 bg-white shrink-0">
          <button
            @click="zoomOut"
            :disabled="zoom <= ZOOM_MIN"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Alejar"
          >
            <ZoomOut :size="13" />
          </button>
          <button
            @click="resetZoom"
            class="text-[11px] font-bold text-slate-500 w-11 text-center hover:text-[#2447F9] transition-all"
            title="Restablecer zoom"
          >
            {{ Math.round(zoom * 100) }}%
          </button>
          <button
            @click="zoomIn"
            :disabled="zoom >= ZOOM_MAX"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Acercar"
          >
            <ZoomIn :size="13" />
          </button>
        </div>
        <button
          @click="abrirNueva('Lead')"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
        >
          <Plus :size="14" /> Nueva tarjeta
        </button>
      </div>
    </div>

    <div class="rounded-xl border border-slate-200 bg-slate-50/40 overflow-auto" style="height: 65vh; min-height: 420px">
      <div class="flex gap-4 p-4" :style="{ zoom, minHeight: '560px' }">
        <KanbanColumn
          v-for="etapa in ETAPAS"
          :key="etapa"
          :etapa="etapa"
          :color="ETAPA_COLOR[etapa]"
          :tarjetas="porEtapa(etapa)"
          :valor="valorEtapa(etapa)"
          :is-drop-target="dropTarget === etapa"
          :dragging-id="draggingId"
          :drop-indicator="dropIndicator"
          @dragover="onDragOver($event, etapa)"
          @dragleave="onDragLeave($event)"
          @drop="onDrop($event, etapa)"
          @dragstart="onDragStart"
          @dragend="onDragEnd"
          @dragover-card="onDragOverCard"
          @add="abrirNueva(etapa)"
        />
      </div>
    </div>

    <NuevaTarjetaDialog
      v-model:visible="nuevaVisible"
      v-model:draft="draft"
      :etapa="draft.etapa"
      @submit="confirmarCreacion"
    />
  </div>
</template>
