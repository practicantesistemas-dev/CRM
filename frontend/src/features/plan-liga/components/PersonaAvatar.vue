<script setup lang="ts">
withDefaults(defineProps<{
  nombre: string
  size?: 'sm' | 'md'
  bg?: string
  color?: string
}>(), { size: 'md', bg: '#FCE7F3', color: '#EC4899' })

const iniciales = (nombre: string) => nombre.split(' ').map(n => n[0]).slice(0, 2).join('')
</script>

<template>
  <div
    class="rounded-xl font-bold flex items-center justify-center flex-shrink-0"
    :class="size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-9 h-9 text-[11px]'"
    :style="{ backgroundColor: bg, color }"
  >
    {{ iniciales(nombre) }}
  </div>
</template>
