<script setup lang="ts">
import { Building2, User, Award, DollarSign, Layers, GripVertical } from 'lucide-vue-next'
import type { EtapaColor } from '../types/tarjeta'
import type { Oportunidad } from '@/features/oportunidades/types/oportunidad'
import { clienteLabel } from '@/features/oportunidades/constants/oportunidades.constants'

const props = defineProps<{
  oportunidad: Oportunidad
  color: EtapaColor
  dragging: boolean
  dropIndicator?: 'before' | 'after' | null
}>()
const emit = defineEmits<{
  dragstart: [e: DragEvent]
  dragend: []
  dragoverCard: [id: number, position: 'before' | 'after']
}>()

const iconoCliente = () => props.oportunidad.tipoCliente === 'titular' ? Award : props.oportunidad.tipoCliente === 'contacto' ? User : Building2

const clienteSecundario = () => {
  const o = props.oportunidad
  if (o.tipoCliente === 'titular') return 'Titular Plan Liga'
  if (o.tipoCliente === 'contacto') return 'Contacto'
  return o.contactoNombre || 'Sin contacto asociado'
}

const onDragOverCard = (e: DragEvent) => {
  if (props.dragging) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const position: 'before' | 'after' = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
  emit('dragoverCard', props.oportunidad.id, position)
}
</script>

<template>
  <div
    :draggable="true"
    data-kanban-card
    @dragstart="emit('dragstart', $event)"
    @dragend="emit('dragend')"
    @dragover="onDragOverCard"
    class="relative surface-card rounded-xl shadow-sm p-3 transition-all select-none"
    :class="dragging
      ? 'opacity-40 scale-[.97] shadow-none cursor-grabbing'
      : 'hover:shadow-md cursor-grab'"
  >
    <div
      v-if="dropIndicator === 'before'"
      class="absolute -top-1.5 left-0 right-0 h-0.5 rounded-full bg-[#2447F9]"
    />
    <div class="flex items-center justify-between mb-2">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" :style="{ backgroundColor: color.dot }">
        {{ clienteLabel(oportunidad).split(' ').map(w => w[0]).slice(0, 2).join('') }}
      </div>
      <GripVertical :size="13" class="text-slate-300 dark:text-slate-600" />
    </div>

    <div class="text-[12px] font-bold text-heading truncate flex items-center gap-1 mb-0.5">
      <component :is="iconoCliente()" :size="10" class="text-slate-400 dark:text-slate-500 flex-shrink-0" />{{ clienteLabel(oportunidad) }}
    </div>
    <div class="text-[10px] text-muted flex items-center gap-1 mb-2">
      <User :size="9" />{{ clienteSecundario() }}
    </div>

    <div class="flex items-center justify-between gap-2">
      <div class="text-[11px] font-bold text-heading flex items-center gap-0.5">
        <DollarSign :size="10" class="text-emerald-500 dark:text-emerald-400" />{{ oportunidad.valor.replace('$', '') }}
      </div>
      <div v-if="oportunidad.servicio" class="text-[9px] text-muted flex items-center gap-1 truncate">
        <Layers :size="9" class="flex-shrink-0" />{{ oportunidad.servicio }}
      </div>
    </div>

    <div v-if="oportunidad.responsable" class="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5">
      <div class="w-4 h-4 rounded-full bg-[#EEF2FF] dark:bg-blue-950/50 text-[#2447F9] dark:text-blue-400 text-[7px] font-bold flex items-center justify-center flex-shrink-0">
        {{ oportunidad.responsable.split(' ').map(n => n[0]).join('') }}
      </div>
      <span class="text-[9px] text-muted truncate">{{ oportunidad.responsable }}</span>
    </div>

    <div
      v-if="dropIndicator === 'after'"
      class="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[#2447F9]"
    />
  </div>
</template>
