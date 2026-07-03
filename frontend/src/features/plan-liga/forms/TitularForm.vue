<script setup lang="ts">
import type { TitularDraft } from '../types/plan-liga'

const draft = defineModel<TitularDraft>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
      <input v-model="draft.nombre" placeholder="Ej: Carlos Mendoza Ruiz" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Documento *</label>
      <input v-model="draft.documento" placeholder="Número de documento" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de nacimiento</label>
      <input v-model="draft.fechaNacimiento" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Correo</label>
      <input v-model="draft.correo" type="email" placeholder="correo@empresa.com" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
      <input v-model="draft.telefono" placeholder="300-000-0000" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
      <input v-model="draft.empresa" placeholder="Nombre empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Plan contratado</label>
      <select v-model="draft.planContratado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Plan Liga Empresarial">Plan Liga Empresarial</option>
        <option value="Plan Liga Individual">Plan Liga Individual</option>
      </select>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha de inscripción</label>
      <input v-model="draft.fechaInscripcion" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Estado</label>
      <select v-model="draft.estado" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all cursor-pointer">
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
  </div>
</template>
