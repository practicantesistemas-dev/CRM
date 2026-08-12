<script setup lang="ts">
import { CUPO_MAXIMO } from '../constants/plan-liga.constants'

const props = withDefaults(defineProps<{
  activos: number
  max?: number
  variant?: 'dots' | 'bar'
}>(), { variant: 'dots', max: CUPO_MAXIMO })
</script>

<template>
  <div v-if="variant === 'dots'" class="flex gap-0.5">
    <div v-for="slot in props.max" :key="slot" class="w-4 h-4 rounded-sm border transition-all"
      :class="slot <= activos ? 'bg-[#EC4899] border-[#EC4899]' : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'" />
  </div>
  <div v-else class="flex gap-2">
    <div v-for="slot in props.max" :key="slot" class="flex-1 h-2.5 rounded-full transition-all" :class="slot <= activos ? 'bg-[#EC4899]' : 'bg-slate-100 dark:bg-slate-700'" />
  </div>
</template>
