<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, Download } from 'lucide-vue-next'
import type { EtapaOportunidad, Oportunidad, OportunidadDraft } from '../types/oportunidad'
import { ETAPAS, OPORTUNIDAD_DRAFT_VACIO } from '../constants/oportunidades.constants'
import { useOportunidades } from '../composables/useOportunidades'
import { exportarOportunidadesExcel } from '../utils/exportarOportunidadesExcel'
import EtapasResumen from '../components/EtapasResumen.vue'
import OportunidadFormDialog from '../dialogs/OportunidadFormDialog.vue'
import OportunidadesTable from '../tables/OportunidadesTable.vue'
import { permisosDeModulo } from '@/features/auth/composables/useAuth'

const { gestionar: puedeGestionar } = permisosDeModulo('oportunidades')

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

const exportar = () => exportarOportunidadesExcel(
  oportunidadesFiltradas.value,
  buscar.value,
  filtroEstado.value,
  filtroResponsable.value,
)
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-heading flex items-center gap-2">
          Gestión de Oportunidades
          <span class="bg-[#FCE7F3] dark:bg-pink-950/40 text-[#EC4899] dark:text-pink-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ valorTotal }}</span>
        </h2>
        <p class="text-[12px] text-muted mt-0.5">Pipeline comercial · empresas, contactos y servicios asociados</p>
      </div>
      <div class="flex items-center gap-2">
        <button @click="exportar" class="flex items-center gap-1.5 h-9 px-4 rounded-lg border-default surface-card text-[11px] font-semibold text-body surface-hover transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button v-if="puedeGestionar" @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nueva oportunidad
        </button>
      </div>
    </div>

    <EtapasResumen :etapas="ETAPAS" :oportunidades="oportunidades" :filtro-estado="filtroEstado" @toggle-etapa="toggleEtapa" />

    <div class="surface-card rounded-2xl shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input v-model="buscar" placeholder="Buscar por empresa, contacto o servicio..." class="w-full h-9 pl-9 pr-4 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9] focus:bg-white dark:focus:bg-slate-800 transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg input-surface text-[11px] font-medium text-body outline-none cursor-pointer">
            <option value="todos">Etapa: Todas</option>
            <option v-for="e in ETAPAS" :key="e" :value="e">{{ e }}</option>
          </select>
          <select v-model="filtroResponsable" class="h-9 px-3 rounded-lg input-surface text-[11px] font-medium text-body outline-none cursor-pointer">
            <option value="todos">Responsable: Todos</option>
            <option v-for="r in responsables" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>
    </div>

    <OportunidadesTable
      :rows="oportunidadesFiltradas"
      :puede-gestionar="puedeGestionar"
      @editar="abrirEditar"
      @ganar="marcarGanada"
      @perder="marcarPerdida"
    />

    <OportunidadFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      @submit="guardar"
    />
  </div>
</template>
