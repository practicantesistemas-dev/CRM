<script setup lang="ts">
import type { TarjetaDraft } from '../types/tarjeta'

const draft = defineModel<TarjetaDraft>({ required: true })
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa *</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto</label>
      <input v-model="draft.contacto" placeholder="Nombre contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Valor</label>
        <input v-model="draft.valor" placeholder="$0" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
      <div>
        <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Seguimiento</label>
        <input v-model="draft.seguimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
      </div>
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
