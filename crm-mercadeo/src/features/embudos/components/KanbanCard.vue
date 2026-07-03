<script setup lang="ts">
import { Building2, User, DollarSign, Calendar, GripVertical } from 'lucide-vue-next'
import type { EtapaColor, Tarjeta } from '../types/tarjeta'

defineProps<{
  tarjeta: Tarjeta
  color: EtapaColor
  dragging: boolean
}>()
const emit = defineEmits<{ dragstart: [e: DragEvent]; dragend: [] }>()
</script>

<template>
  <div
    :draggable="true"
    @dragstart="emit('dragstart', $event)"
    @dragend="emit('dragend')"
    class="bg-white rounded-xl border border-slate-200 shadow-sm p-3 transition-all select-none"
    :class="dragging
      ? 'opacity-40 scale-[.97] shadow-none cursor-grabbing'
      : 'hover:shadow-md cursor-grab'"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[9px] font-bold" :style="{ backgroundColor: color.dot }">
        {{ tarjeta.empresa.split(' ').map(w => w[0]).slice(0, 2).join('') }}
      </div>
      <GripVertical :size="13" class="text-slate-300" />
    </div>

    <div class="text-[12px] font-bold text-[#0F172A] truncate flex items-center gap-1 mb-0.5">
      <Building2 :size="10" class="text-slate-400 flex-shrink-0" />{{ tarjeta.empresa }}
    </div>
    <div class="text-[10px] text-slate-400 flex items-center gap-1 mb-2">
      <User :size="9" />{{ tarjeta.contacto }}
    </div>

    <div class="flex items-center justify-between">
      <div class="text-[11px] font-bold text-[#0F172A] flex items-center gap-0.5">
        <DollarSign :size="10" class="text-emerald-500" />{{ tarjeta.valor.replace('$', '') }}
      </div>
      <div class="text-[9px] text-slate-400 flex items-center gap-1">
        <Calendar :size="9" />{{ tarjeta.seguimiento }}
      </div>
    </div>

    <div class="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5">
      <div class="w-4 h-4 rounded-full bg-[#EEF2FF] text-[#2447F9] text-[7px] font-bold flex items-center justify-center flex-shrink-0">
        {{ tarjeta.responsable.split(' ').map(n => n[0]).join('') }}
      </div>
      <span class="text-[9px] text-slate-400 truncate">{{ tarjeta.responsable }}</span>
    </div>
  </div>
</template>
