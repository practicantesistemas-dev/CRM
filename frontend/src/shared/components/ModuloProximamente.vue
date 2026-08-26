<script setup lang="ts">
import { Construction } from 'lucide-vue-next'

defineProps<{ modulo: string }>()
</script>

<template>
  <div class="h-full flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 text-center">
      <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mb-4">
        <Construction :size="26" class="text-amber-500 dark:text-amber-400" />
      </div>
      <p class="text-[13px] font-semibold text-slate-600 dark:text-slate-300">
        Este módulo aún no está implementado ({{ modulo }})
      </p>
    </div>
  </div>
</template>
