<script setup lang="ts">
withDefaults(defineProps<{
  nombre: string
  size?: 'sm' | 'md'
  bg?: string
  color?: string
}>(), { size: 'md', bg: '#E8EAF6', color: '#1A2A6C' })

const iniciales = (nombre: string) => nombre.split(' ').map(w => w[0]).slice(0, 2).join('')
</script>

<template>
  <div
    class="rounded-xl font-bold flex items-center justify-center flex-shrink-0"
    :class="size === 'sm' ? 'w-6 h-6 !rounded-full text-[8px]' : 'w-9 h-9 text-[11px]'"
    :style="{ backgroundColor: bg, color }"
  >
    {{ iniciales(nombre) }}
  </div>
</template>
