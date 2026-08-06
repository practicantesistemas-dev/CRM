<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Plus, Download } from 'lucide-vue-next'
import type { Empresa, EmpresaDraft } from '../types/empresa'
import { EMPRESA_DRAFT_VACIO, HISTORIAL_MOCK } from '../constants/empresas.constants'
import { useEmpresas } from '../composables/useEmpresas'
import EmpresaFormDialog from '../dialogs/EmpresaFormDialog.vue'
import HistorialDrawer from '../dialogs/HistorialDrawer.vue'
import EmpresasTable from '../tables/EmpresasTable.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

const {
  empresas, cargandoEmpresas, errorEmpresas, cargarEmpresas,
  buscar, filtroEstado, filtroIndustria,
  empresasFiltradas, industrias,
  crearEmpresa, actualizarEmpresa, guardandoEmpresa, errorGuardarEmpresa,
  eliminarEmpresa, errorEliminarEmpresa,
} = useEmpresas()

onMounted(() => { cargarEmpresas() })

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const empresaEditando = ref<Empresa | null>(null)
const draft = ref<EmpresaDraft>({ ...EMPRESA_DRAFT_VACIO })

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  empresaEditando.value = null
  errorGuardarEmpresa.value = null
  draft.value = { ...EMPRESA_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (e: Empresa) => {
  modalModo.value = 'editar'
  empresaEditando.value = e
  errorGuardarEmpresa.value = null
  draft.value = { razonSocial: e.razonSocial, nit: e.nit, industria: e.industria, direccion: e.direccion, ciudad: e.ciudad, estado: e.estado }
  modalVisible.value = true
}
const guardar = async () => {
  if (modalModo.value === 'nuevo') {
    const ok = await crearEmpresa(draft.value)
    if (ok) modalVisible.value = false
  } else if (empresaEditando.value) {
    const ok = await actualizarEmpresa(empresaEditando.value.id, draft.value)
    if (ok) modalVisible.value = false
  }
}

const confirmBorrarVisible = ref(false)
const empresaABorrar = ref<Empresa | null>(null)
const pedirBorrarEmpresa = (e: Empresa) => {
  empresaABorrar.value = e
  errorEliminarEmpresa.value = null
  confirmBorrarVisible.value = true
}
const confirmarBorrado = async () => {
  if (empresaABorrar.value) await eliminarEmpresa(empresaABorrar.value.id)
  empresaABorrar.value = null
}

const drawerVisible = ref(false)
const empresaHistorial = ref<Empresa | null>(null)
const abrirHistorial = (e: Empresa) => { empresaHistorial.value = e; drawerVisible.value = true }
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Empresas
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ empresas.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Empresas vinculadas e industrias</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nueva empresa
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por razón social, NIT o ciudad..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activa">Activa</option>
            <option value="Inactiva">Inactiva</option>
          </select>
          <select v-model="filtroIndustria" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Industria: Todas</option>
            <option v-for="ind in industrias" :key="ind" :value="ind">{{ ind }}</option>
          </select>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        <template v-if="cargandoEmpresas">Cargando empresas...</template>
        <template v-else>
          Mostrando <strong class="text-slate-600">{{ empresasFiltradas.length }}</strong> empresas
        </template>
      </div>
      <p v-if="errorEmpresas" class="mt-1 text-[11px] font-medium text-red-500">{{ errorEmpresas }}</p>
      <p v-if="errorEliminarEmpresa" class="mt-1 text-[11px] font-medium text-red-500">{{ errorEliminarEmpresa }}</p>
    </div>

    <EmpresasTable :rows="empresasFiltradas" @editar="abrirEditar" @historial="abrirHistorial" @borrar="pedirBorrarEmpresa" />

    <EmpresaFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      :guardando="guardandoEmpresa"
      :error="errorGuardarEmpresa"
      @submit="guardar"
    />

    <HistorialDrawer
      v-model:visible="drawerVisible"
      :empresa="empresaHistorial"
      :items="HISTORIAL_MOCK"
    />

    <ConfirmDialog
      v-model:visible="confirmBorrarVisible"
      titulo="Eliminar empresa"
      :mensaje="`¿Eliminar a ${empresaABorrar?.razonSocial}? Esta acción no se puede deshacer.`"
      @confirmar="confirmarBorrado"
    />
  </div>
</template>
