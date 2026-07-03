<script setup lang="ts">
import type { OportunidadDraft } from '../types/oportunidad'
import { ETAPAS } from '../constants/oportunidades.constants'

const draft = defineModel<OportunidadDraft>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
      <input v-model="draft.contacto" placeholder="Nombre contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Servicio *</label>
      <select v-model="draft.servicio" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar servicio</option>
        <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
        <option value="Plan Liga Individual">Plan Liga Individual</option>
        <option value="Tamizajes">Tamizajes</option>
        <option value="Brigadas de Salud">Brigadas de Salud</option>
        <option value="Capacitaciones">Capacitaciones</option>
        <option value="Programas de Bienestar">Programas de Bienestar</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
      <input v-model="draft.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Probabilidad ({{ draft.probabilidad }}%)</label>
      <input v-model.number="draft.probabilidad" type="range" min="0" max="100" step="5" class="w-full h-2 rounded-lg appearance-none cursor-pointer mt-3" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Etapa</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option v-for="e in ETAPAS" :key="e" :value="e">{{ e }}</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Responsable</label>
      <select v-model="draft.responsable" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar</option>
        <option value="María García">María García</option>
        <option value="Juan López">Juan López</option>
        <option value="Carlos Torres">Carlos Torres</option>
      </select>
    </div>
  </div>
</template>
