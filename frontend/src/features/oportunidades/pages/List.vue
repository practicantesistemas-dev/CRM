<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import type { EtapaOportunidad, Oportunidad, OportunidadDraft } from '../types/oportunidad'
import { ETAPAS, OPORTUNIDAD_DRAFT_VACIO } from '../constants/oportunidades.constants'
import { useOportunidades } from '../composables/useOportunidades'
import EtapasResumen from '../components/EtapasResumen.vue'
import OportunidadFormDialog from '../dialogs/OportunidadFormDialog.vue'
import OportunidadesTable from '../tables/OportunidadesTable.vue'

const {
  oportunidades, buscar, filtroEstado, filtroResponsable,
  oportunidadesFiltradas, responsables, valorTotal,
  crearOportunidad, actualizarOportunidad, marcarGanada, marcarPerdida,
} = useOportunidades()

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const oportunidadEditando = ref<Oportunidad | null>(null)
const draft = ref<OportunidadDraft>({ ...OPORTUNIDAD_DRAFT_VACIO })

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  oportunidadEditando.value = null
  draft.value = { ...OPORTUNIDAD_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (o: Oportunidad) => {
  modalModo.value = 'editar'
  oportunidadEditando.value = o
  draft.value = { ...o }
  modalVisible.value = true
}
const guardar = () => {
  if (modalModo.value === 'nuevo') {
    crearOportunidad(draft.value)
  } else if (oportunidadEditando.value) {
    actualizarOportunidad(oportunidadEditando.value.id, draft.value)
  }
  modalVisible.value = false
}

const toggleEtapa = (etapa: EtapaOportunidad) => {
  filtroEstado.value = filtroEstado.value === etapa ? 'todos' : etapa
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Oportunidades
          <span class="bg-[#FCE7F3] text-[#EC4899] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ valorTotal }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Pipeline comercial · empresas, contactos y servicios asociados</p>
      </div>
      <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
        <Plus :size="14" /> Nueva oportunidad
      </button>
    </div>

    <EtapasResumen :etapas="ETAPAS" :oportunidades="oportunidades" :filtro-estado="filtroEstado" @toggle-etapa="toggleEtapa" />

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por empresa, contacto o servicio..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Etapa: Todas</option>
            <option v-for="e in ETAPAS" :key="e" :value="e">{{ e }}</option>
          </select>
          <select v-model="filtroResponsable" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Responsable: Todos</option>
            <option v-for="r in responsables" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>
    </div>

    <OportunidadesTable :rows="oportunidadesFiltradas" @editar="abrirEditar" @ganar="marcarGanada" @perder="marcarPerdida" />

    <OportunidadFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      @submit="guardar"
    />
  </div>
</template>
