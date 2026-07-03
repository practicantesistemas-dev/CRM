<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Filter } from 'lucide-vue-next'
import type { ActividadDraft } from '../types/actividad'
import { ACTIVIDAD_DRAFT_VACIO } from '../constants/relacionamiento.constants'
import { useRelacionamiento } from '../composables/useRelacionamiento'
import FiltrosTipo from '../components/FiltrosTipo.vue'
import TimelineItem from '../components/TimelineItem.vue'
import ActividadFormDialog from '../dialogs/ActividadFormDialog.vue'

const {
  actividades, filtroTipo, filtroUsuario, buscar,
  actividadesFiltradas, usuarios,
  crearActividad,
} = useRelacionamiento()

const modalVisible = ref(false)
const draft = ref<ActividadDraft>({ ...ACTIVIDAD_DRAFT_VACIO })

const abrirNuevo = () => {
  draft.value = { ...ACTIVIDAD_DRAFT_VACIO, fecha: new Date().toISOString().split('T')[0] }
  modalVisible.value = true
}

const guardar = () => {
  if (!draft.value.contacto || !draft.value.accion) return
  crearActividad(draft.value)
  modalVisible.value = false
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Bitácora de Relacionamiento
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ actividades.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Historial completo de interacciones · llamadas, correos, reuniones</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
        <Plus :size="14" /> Registrar actividad
      </button>
    </div>

    <FiltrosTipo :actividades="actividades" :filtro-tipo="filtroTipo" @update:filtro-tipo="filtroTipo = $event" />

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Filter :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por contacto, empresa o acción..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <select v-model="filtroUsuario" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
          <option value="todos">Todos los usuarios</option>
          <option v-for="u in usuarios" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ actividadesFiltradas.length }}</strong> actividades
      </div>
    </div>

    <div class="space-y-3">
      <TimelineItem v-for="a in actividadesFiltradas" :key="a.id" :actividad="a" />

      <div v-if="actividadesFiltradas.length === 0" class="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 text-[12px]">
        No se encontraron actividades con los filtros aplicados.
      </div>
    </div>

    <ActividadFormDialog v-model:visible="modalVisible" v-model:draft="draft" @submit="guardar" />
  </div>
</template>
