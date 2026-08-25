<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    titulo: string
    subtitulo?: string
    abiertoPorDefecto?: boolean
  }>(),
  { abiertoPorDefecto: true },
)

const abierto = ref(props.abiertoPorDefecto)
</script>

<template>
  <section class="space-y-3">
    <button
      type="button"
      @click="abierto = !abierto"
      class="w-full flex items-center justify-between gap-2 text-left"
    >
      <div>
        <h2 class="text-[16px] font-bold text-heading">{{ titulo }}</h2>
        <p v-if="subtitulo" class="text-[12px] text-muted mt-0.5">{{ subtitulo }}</p>
      </div>
      <ChevronDown
        :size="18"
        class="shrink-0 text-muted transition-transform"
        :class="{ '-rotate-180': !abierto }"
      />
    </button>

    <div v-show="abierto">
      <slot />
    </div>
  </section>
</template>
