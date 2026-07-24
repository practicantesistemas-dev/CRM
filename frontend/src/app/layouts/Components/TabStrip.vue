<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Tab } from './menu.config'

defineProps<{
  tabs: Tab[];
  activeIdx: number;
  maxTabs: number;
}>()

const emit = defineEmits<{
  (e: 'go-to', index: number): void;
  (e: 'close', index: number, event: MouseEvent): void;
}>()
</script>

<template>
  <div class="bg-white border-b border-slate-200 px-3 flex items-end gap-0.5 shrink-0 overflow-x-auto">
    <button
      v-for="(tab, idx) in tabs"
      :key="tab.key"
      @click="emit('go-to', idx)"
      class="flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-semibold border-b-2 transition-all shrink-0 group/tab rounded-t-lg hover:bg-slate-50"
      :class="idx === activeIdx ? 'border-[#1E3A8A] text-[#1E3A8A] bg-[#EEF2FF]/60' : 'border-transparent text-slate-500 hover:text-slate-700'"
    >
      <component :is="tab.icono" :size="12" class="shrink-0" />
      <span class="max-w-[120px] truncate">{{ tab.label }}</span>
      <span
        v-if="tabs.length > 1"
        @click.stop="emit('close', idx, $event)"
        class="w-4 h-4 rounded flex items-center justify-center ml-0.5 opacity-0 group-hover/tab:opacity-100 hover:!bg-slate-200 transition-all"
        :class="idx === activeIdx ? 'text-[#1E3A8A] hover:bg-[#DBEAFE]' : 'text-slate-400 hover:bg-slate-100'"
      >
        <X :size="9" />
      </span>
    </button>

    <div v-if="tabs.length >= maxTabs" class="ml-auto px-2 py-2 text-[10px] text-slate-400 font-semibold shrink-0 self-center">
      {{ maxTabs }}/{{ maxTabs }} pestañas
    </div>
  </div>
</template>