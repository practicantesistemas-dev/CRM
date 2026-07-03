<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { TarjetaDraft } from '../types/tarjeta'
import { ETAPAS, ETAPA_COLOR, TARJETA_DRAFT_VACIO } from '../constants/embudos.constants'
import { useEmbudos } from '../composables/useEmbudos'
import KanbanColumn from '../components/KanbanColumn.vue'
import NuevaTarjetaDialog from '../dialogs/NuevaTarjetaDialog.vue'

const {
  draggingId, dropTarget,
  onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
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
  if (!draft.value.empresa) return
  crearTarjeta({ ...draft.value, valor: draft.value.valor || '$0' })
  nuevaVisible.value = false
}
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
      <button
        @click="abrirNueva('Lead')"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
      >
        <Plus :size="14" /> Nueva tarjeta
      </button>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4" style="min-height: 560px">
      <KanbanColumn
        v-for="etapa in ETAPAS"
        :key="etapa"
        :etapa="etapa"
        :color="ETAPA_COLOR[etapa]"
        :tarjetas="porEtapa(etapa)"
        :valor="valorEtapa(etapa)"
        :is-drop-target="dropTarget === etapa"
        :dragging-id="draggingId"
        @dragover="onDragOver($event, etapa)"
        @dragleave="onDragLeave($event)"
        @drop="onDrop($event, etapa)"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @add="abrirNueva(etapa)"
      />
    </div>

    <NuevaTarjetaDialog
      v-model:visible="nuevaVisible"
      v-model:draft="draft"
      :etapa="draft.etapa"
      @submit="confirmarCreacion"
    />
  </div>
</template>
