<script setup lang="ts">
import { X, ClipboardList, Loader2 } from 'lucide-vue-next'
import type { Contacto, HistorialItem } from '../types/contacto'

defineProps<{ contacto: Contacto | null; items: HistorialItem[]; cargando?: boolean }>()
const emit = defineEmits<{ registrar: [] }>()

const visible = defineModel<boolean>('visible', { required: true })
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999]" @click.self="visible = false">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="visible = false" />
    <div class="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-800 shadow-2xl flex flex-col z-10">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-900">
        <div>
          <h3 class="text-[13px] font-bold text-[#0F172A] dark:text-slate-100">Historial</h3>
          <p class="text-[11px] text-slate-400 dark:text-slate-500">{{ contacto?.nombre }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
      </div>
      <div class="flex-1 overflow-y-auto p-5 space-y-3">
        <div v-if="cargando" class="flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 py-8">
          <Loader2 :size="14" class="animate-spin" /> Cargando historial...
        </div>
        <p v-else-if="items.length === 0" class="text-center text-[11px] text-slate-400 dark:text-slate-500 py-8">Sin actividades registradas.</p>
        <template v-else>
          <div v-for="(act, i) in items" :key="i" class="flex gap-3">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
              <component :is="act.icono" :size="13" :style="{ color: act.color }" />
            </div>
            <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-bold uppercase" :style="{ color: act.color }">{{ act.tipo }}</span>
                <span class="text-[10px] text-slate-400 dark:text-slate-500">{{ act.fecha }}</span>
              </div>
              <p class="text-[11px] text-slate-700 dark:text-slate-300">{{ act.desc }}</p>
              <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Por {{ act.usuario }}</p>
            </div>
          </div>
        </template>
      </div>
      <div class="px-5 py-4 border-t border-slate-200 dark:border-slate-700">
        <button @click="visible = false; emit('registrar')"
          class="w-full h-9 rounded-lg bg-[#059669] text-white text-[11px] font-bold hover:bg-[#047857] transition-all flex items-center justify-center gap-1.5">
          <ClipboardList :size="13" /> Registrar actividad
        </button>
      </div>
    </div>
  </div>
</template>
