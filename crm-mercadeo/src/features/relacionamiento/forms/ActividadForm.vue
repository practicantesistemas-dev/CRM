<script setup lang="ts">
import type { ActividadDraft } from '../types/actividad'
import { TIPOS_ACTIVIDAD, TIPO_META } from '../constants/relacionamiento.constants'

const draft = defineModel<ActividadDraft>({ required: true })
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-2 uppercase tracking-wide">Tipo de actividad</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="tipo in TIPOS_ACTIVIDAD" :key="tipo"
          @click="draft.tipo = tipo"
          class="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold border transition-all"
          :class="draft.tipo === tipo ? 'text-white border-transparent shadow' : 'bg-white border-slate-200 text-slate-500'"
          :style="draft.tipo === tipo ? { backgroundColor: TIPO_META[tipo].color } : {}"
        >
          <component :is="TIPO_META[tipo].icono" :size="11" /> {{ tipo }}
        </button>
      </div>
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Contacto *</label>
      <input v-model="draft.contacto" placeholder="Nombre del contacto" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Empresa</label>
      <input v-model="draft.empresa" placeholder="Empresa" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Acción realizada *</label>
      <textarea v-model="draft.accion" placeholder="Describa la actividad realizada..." rows="3" class="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all resize-none" />
    </div>
    <div class="sm:col-span-2">
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Próximo paso</label>
      <input v-model="draft.proximoPaso" placeholder="¿Cuál es el siguiente paso?" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Fecha</label>
      <input v-model="draft.fecha" type="date" class="w-full h-10 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
    </div>
    <div>
      <label class="block text-[11px] font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Usuario</label>
      <select v-model="draft.usuario" class="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all cursor-pointer">
        <option value="">Seleccionar</option>
        <option value="María García">María García</option>
        <option value="Juan López">Juan López</option>
        <option value="Carlos Torres">Carlos Torres</option>
      </select>
    </div>
  </div>
</template>
