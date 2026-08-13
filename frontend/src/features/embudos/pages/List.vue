<script setup lang="ts">
import { ref } from 'vue'
import { Plus, ZoomIn, ZoomOut } from 'lucide-vue-next'
import type { EtapaOportunidad, OportunidadDraft } from '@/features/oportunidades/types/oportunidad'
import { ETAPAS, OPORTUNIDAD_DRAFT_VACIO } from '@/features/oportunidades/constants/oportunidades.constants'
import { useOportunidades } from '@/features/oportunidades/composables/useOportunidades'
import OportunidadFormDialog from '@/features/oportunidades/dialogs/OportunidadFormDialog.vue'
import { ETAPA_COLOR } from '../constants/embudos.constants'
import { useEmbudos } from '../composables/useEmbudos'
import KanbanColumn from '../components/KanbanColumn.vue'

const { oportunidades, crearOportunidad, cambiarEtapa } = useOportunidades()

const {
  draggingId, dropTarget, dropIndicator,
  onDragStart, onDragEnd, onDragOver, onDragOverCard, onDragLeave, onDrop,
  porEtapa, valorEtapa, totalOportunidades, totalValor,
} = useEmbudos(oportunidades, (id, etapa) => {
  const o = oportunidades.value.find(x => x.id === id)
  if (o) cambiarEtapa(o, etapa)
})

const nuevaVisible = ref(false)
const draft = ref<OportunidadDraft>({ ...OPORTUNIDAD_DRAFT_VACIO })

const abrirNueva = (etapa: EtapaOportunidad) => {
  draft.value = { ...OPORTUNIDAD_DRAFT_VACIO, estado: etapa }
  nuevaVisible.value = true
}

const confirmarCreacion = async () => {
  if (await crearOportunidad(draft.value)) nuevaVisible.value = false
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
        <h2 class="text-[18px] font-bold text-heading flex items-center gap-2">
          Tablero
          <span class="bg-[#EEF2FF] dark:bg-blue-950/40 text-[#2447F9] dark:text-blue-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ totalOportunidades }}</span>
        </h2>
        <p class="text-[12px] text-muted mt-0.5">
          Pipeline Kanban · arrastra las tarjetas para cambiar etapa · valor total:
          <strong class="text-heading">{{ totalValor }}</strong>
        </p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-0.5 border-default rounded-lg p-1 surface-card shrink-0">
          <button
            @click="zoomOut"
            :disabled="zoom <= ZOOM_MIN"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Alejar"
          >
            <ZoomOut :size="13" />
          </button>
          <button
            @click="resetZoom"
            class="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-11 text-center hover:text-[#2447F9] transition-all"
            title="Restablecer zoom"
          >
            {{ Math.round(zoom * 100) }}%
          </button>
          <button
            @click="zoomIn"
            :disabled="zoom >= ZOOM_MAX"
            class="w-7 h-7 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
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

    <div class="rounded-xl border border-default bg-slate-50/40 dark:bg-slate-900/60 overflow-auto" style="height: 65vh; min-height: 420px">
      <div class="flex gap-4 p-4" :style="{ zoom, minHeight: '560px' }">
        <KanbanColumn
          v-for="etapa in ETAPAS"
          :key="etapa"
          :etapa="etapa"
          :color="ETAPA_COLOR[etapa]"
          :oportunidades="porEtapa(etapa)"
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

    <OportunidadFormDialog
      v-model:visible="nuevaVisible"
      v-model:draft="draft"
      modo="nuevo"
      @submit="confirmarCreacion"
    />
  </div>
</template>
