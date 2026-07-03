<script setup lang="ts">
import { X, ChevronRight } from 'lucide-vue-next'
import type { Empresa, HistorialItem } from '../types/empresa'

defineProps<{ empresa: Empresa | null; items: HistorialItem[] }>()

const visible = defineModel<boolean>('visible', { required: true })
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999]" @click.self="visible = false">
    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="visible = false" />
    <div class="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col z-10">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[13px] font-bold text-[#0F172A]">Historial</h3>
          <p class="text-[11px] text-slate-400">{{ empresa?.razonSocial }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="flex-1 overflow-y-auto p-5 space-y-3">
        <div v-for="(act, i) in items" :key="i" class="flex gap-3">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
            <ChevronRight :size="13" :style="{ color: act.color }" />
          </div>
          <div class="flex-1 bg-slate-50 rounded-xl p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase" :style="{ color: act.color }">{{ act.tipo }}</span>
              <span class="text-[10px] text-slate-400">{{ act.fecha }}</span>
            </div>
            <p class="text-[11px] text-slate-700">{{ act.desc }}</p>
            <p class="text-[10px] text-slate-400 mt-1">Por {{ act.usuario }}</p>
          </div>
        </div>
      </div>
      <div class="px-5 py-4 border-t border-slate-200">
        <button class="w-full h-9 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold hover:bg-[#1D3DD9] transition-all">+ Registrar actividad</button>
      </div>
    </div>
  </div>
</template>
