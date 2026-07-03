<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import type { Servicio, ServicioDraft } from '../types/servicio'
import { SERVICIO_DRAFT_VACIO } from '../constants/servicios.constants'
import { useServicios } from '../composables/useServicios'
import IndicadoresComerciales from '../components/IndicadoresComerciales.vue'
import TopServiciosSolicitados from '../components/TopServiciosSolicitados.vue'
import DistribucionPorTipo from '../components/DistribucionPorTipo.vue'
import ServicioFormDialog from '../dialogs/ServicioFormDialog.vue'
import ServiciosTable from '../tables/ServiciosTable.vue'

const {
  servicios, buscar, filtroEstado, filtroTipo,
  serviciosFiltrados, totalSolicitudes, totalVentas, totalEmpresas, topServicios,
  crearServicio, actualizarServicio, toggleEstado,
} = useServicios()

const vistaActiva = ref<'lista' | 'indicadores'>('lista')

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const servicioEditando = ref<Servicio | null>(null)
const draft = ref<ServicioDraft>({ ...SERVICIO_DRAFT_VACIO })

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  servicioEditando.value = null
  draft.value = { ...SERVICIO_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (s: Servicio) => {
  modalModo.value = 'editar'
  servicioEditando.value = s
  draft.value = { ...s }
  modalVisible.value = true
}
const guardar = () => {
  if (!draft.value.nombre || !draft.value.codigo) return
  if (modalModo.value === 'nuevo') {
    crearServicio(draft.value)
  } else if (servicioEditando.value) {
    actualizarServicio(servicioEditando.value.id, draft.value)
  }
  modalVisible.value = false
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Servicios Plan Liga
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ servicios.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Administra servicios institucionales, indicadores y asociaciones</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
          <button @click="vistaActiva = 'lista'" class="px-3 py-1.5 text-[11px] font-semibold transition-all" :class="vistaActiva === 'lista' ? 'bg-[#2447F9] text-white' : 'text-slate-500 hover:bg-slate-50'">Lista</button>
          <button @click="vistaActiva = 'indicadores'" class="px-3 py-1.5 text-[11px] font-semibold transition-all" :class="vistaActiva === 'indicadores' ? 'bg-[#2447F9] text-white' : 'text-slate-500 hover:bg-slate-50'">Indicadores</button>
        </div>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo servicio
        </button>
      </div>
    </div>

    <template v-if="vistaActiva === 'lista'">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div class="relative flex-1 min-w-0">
            <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="buscar" placeholder="Buscar por nombre, código o categoría..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
          </div>
          <div class="flex items-center gap-2">
            <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
              <option value="todos">Estado: Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="En revisión">En revisión</option>
            </select>
            <select v-model="filtroTipo" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
              <option value="todos">Tipo: Todos</option>
              <option value="Empresarial">Empresarial</option>
              <option value="Individual">Individual</option>
              <option value="Bienestar">Bienestar</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
        </div>
      </div>

      <ServiciosTable :rows="serviciosFiltrados" @editar="abrirEditar" @toggle-estado="toggleEstado" />
    </template>

    <template v-if="vistaActiva === 'indicadores'">
      <IndicadoresComerciales :total-empresas="totalEmpresas" :total-solicitudes="totalSolicitudes" :total-ventas="totalVentas" />

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopServiciosSolicitados :servicios="topServicios" />
        <DistribucionPorTipo :servicios="servicios" :total-solicitudes="totalSolicitudes" />
      </div>
    </template>

    <ServicioFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      @submit="guardar"
    />
  </div>
</template>
