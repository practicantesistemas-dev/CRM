<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <p v-if="message" class="text-[10px] font-semibold text-red-500 mt-1">{{ message }}</p>
</template>
