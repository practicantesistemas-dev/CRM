<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import type { EtapaColor, Tarjeta } from '../types/tarjeta'
import KanbanCard from './KanbanCard.vue'

defineProps<{
  etapa: string
  color: EtapaColor
  tarjetas: Tarjeta[]
  valor: string
  isDropTarget: boolean
  draggingId: number | null
  dropIndicator: { id: number; position: 'before' | 'after' } | null
}>()

const emit = defineEmits<{
  dragover: [e: DragEvent]
  dragleave: [e: DragEvent]
  drop: [e: DragEvent]
  dragstart: [e: DragEvent, id: number]
  dragend: []
  dragoverCard: [id: number, position: 'before' | 'after']
  add: []
}>()
</script>

<template>
  <div
    class="flex-shrink-0 w-64 flex flex-col gap-2 rounded-xl transition-all duration-150 p-1 -m-1"
    :class="isDropTarget && draggingId !== null ? 'ring-2 ring-[#2447F9] ring-offset-1' : ''"
    @dragover="emit('dragover', $event)"
    @dragleave="emit('dragleave', $event)"
    @drop="emit('drop', $event)"
  >
    <div
      class="flex items-center justify-between px-3 py-2 rounded-xl border"
      :style="{ backgroundColor: color.bg, borderColor: color.border }"
    >
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: color.dot }" />
        <span class="text-[11px] font-bold" :style="{ color: color.text }">{{ etapa }}</span>
        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" :style="{ backgroundColor: color.dot }">
          {{ tarjetas.length }}
        </span>
      </div>
      <div class="text-[9px] font-bold text-slate-400">{{ valor }}</div>
    </div>

    <div
      v-if="isDropTarget && draggingId !== null"
      class="flex-shrink-0 h-14 rounded-xl border-2 border-dashed border-[#2447F9] bg-[#EEF2FF]/60 flex items-center justify-center"
    >
      <span class="text-[11px] text-[#2447F9] font-semibold">Soltar aquí</span>
    </div>

    <div class="flex flex-col gap-2 flex-1">
      <KanbanCard
        v-for="t in tarjetas"
        :key="t.id"
        :tarjeta="t"
        :color="color"
        :dragging="draggingId === t.id"
        :drop-indicator="dropIndicator && dropIndicator.id === t.id ? dropIndicator.position : null"
        @dragstart="emit('dragstart', $event, t.id)"
        @dragend="emit('dragend')"
        @dragover-card="(id, pos) => emit('dragoverCard', id, pos)"
      />

      <button
        @click="emit('add')"
        class="flex items-center justify-center gap-1 w-full py-2 rounded-xl border border-dashed border-slate-300 text-slate-400 text-[11px] hover:border-[#2447F9] hover:text-[#2447F9] transition-all"
      >
        <Plus :size="12" /> Agregar
      </button>
    </div>
  </div>
</template>
