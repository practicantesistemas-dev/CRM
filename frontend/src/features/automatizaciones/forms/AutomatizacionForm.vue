<script setup lang="ts">
import type { AutomatizacionDraft } from '../types/automatizacion'
import { TRIGGERS, ACCIONES, TRIGGER_META, ACCION_META } from '../constants/automatizaciones.constants'

const draft = defineModel<AutomatizacionDraft>({ required: true })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre *</label>
      <input
        v-model="draft.nombre"
        placeholder="Ej: Bienvenida nuevo contacto"
        class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all"
      />
    </div>

    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Descripción</label>
      <textarea
        v-model="draft.descripcion"
        placeholder="¿Qué hace esta automatización?"
        rows="2"
        class="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Disparador (trigger)</label>
        <select
          v-model="draft.trigger"
          class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer"
        >
          <option v-for="t in TRIGGERS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Acción</label>
        <select
          v-model="draft.accion"
          class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer"
        >
          <option v-for="a in ACCIONES" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>
    </div>

    <div class="bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <div class="flex items-center gap-1.5 text-[11px] font-semibold" :style="{ color: TRIGGER_META[draft.trigger].color }">
        <component :is="TRIGGER_META[draft.trigger].icono" :size="13" />
        {{ draft.trigger }}
      </div>
      <div class="text-[11px] text-slate-400 font-bold">→</div>
      <div class="flex items-center gap-1.5 text-[11px] font-semibold" :style="{ color: ACCION_META[draft.accion].color }">
        <component :is="ACCION_META[draft.accion].icono" :size="13" />
        {{ draft.accion }}
      </div>
    </div>
  </div>
</template>
