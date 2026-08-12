<script setup lang="ts">
import { computed } from 'vue'
import { theme } from 'ant-design-vue'
import { useTema } from '@/shared/composables/useTema'

const { esOscuro } = useTema()
const temaAntd = computed(() => ({
  algorithm: esOscuro.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}))
</script>

<template>
  <a-config-provider :theme="temaAntd">
    <router-view />
  </a-config-provider>
</template>
