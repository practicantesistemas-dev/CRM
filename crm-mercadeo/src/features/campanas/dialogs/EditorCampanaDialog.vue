<script setup lang="ts">
import { X, BarChart3, Send } from 'lucide-vue-next'
import type { Campana } from '../types/campana'
import { VARIABLES_DINAMICAS } from '../constants/campanas.constants'

defineProps<{ campana: Campana | null }>()

const visible = defineModel<boolean>('visible', { required: true })
const htmlEditor = defineModel<string>('html', { required: true })

const insertarVariable = (v: string) => {
  htmlEditor.value += ` ${v}`
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self="visible = false">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#F8FAFC]">
        <div>
          <h3 class="text-[14px] font-bold text-[#0F172A]">Editor de Campaña</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">{{ campana?.nombre }}</p>
        </div>
        <button @click="visible = false" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"><X :size="14" /></button>
      </div>
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Variables dinámicas</label>
          <div class="flex gap-2 flex-wrap">
            <button v-for="v in VARIABLES_DINAMICAS" :key="v" @click="insertarVariable(v)" class="inline-flex items-center h-7 px-2.5 rounded-lg bg-[#EEF2FF] text-[#2447F9] text-[10px] font-bold border border-blue-200 hover:bg-[#2447F9] hover:text-white transition-all">
              {{ v }}
            </button>
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Contenido HTML</label>
          <textarea v-model="htmlEditor" rows="12" class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-mono outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none" />
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Vista previa</label>
          <div class="rounded-xl border border-slate-200 bg-white p-6 overflow-auto max-h-48" v-html="htmlEditor" />
        </div>
      </div>
      <div class="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 bg-[#F8FAFC]">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <BarChart3 :size="13" /> Ver métricas
        </button>
        <div class="flex gap-2">
          <button @click="visible = false" class="h-9 px-5 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cerrar</button>
          <button class="flex items-center gap-1.5 h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"><Send :size="13" /> Enviar campaña</button>
        </div>
      </div>
    </div>
  </div>
</template>
