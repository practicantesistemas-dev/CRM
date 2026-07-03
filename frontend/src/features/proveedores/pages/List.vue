<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, Download } from 'lucide-vue-next'
import type { Proveedor, ProveedorDraft } from '../types/proveedor'
import { PROVEEDOR_DRAFT_VACIO } from '../constants/proveedores.constants'
import { useProveedores } from '../composables/useProveedores'
import ProveedorFormDialog from '../dialogs/ProveedorFormDialog.vue'
import ProveedoresTable from '../tables/ProveedoresTable.vue'

const {
  proveedores, buscar, filtroEstado, filtroCategoria,
  proveedoresFiltrados, categorias,
  crearProveedor, actualizarProveedor,
} = useProveedores()

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const proveedorEditando = ref<Proveedor | null>(null)
const draft = ref<ProveedorDraft>({ ...PROVEEDOR_DRAFT_VACIO })

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  proveedorEditando.value = null
  draft.value = { ...PROVEEDOR_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (p: Proveedor) => {
  modalModo.value = 'editar'
  proveedorEditando.value = p
  draft.value = { ...p }
  modalVisible.value = true
}
const guardar = () => {
  if (!draft.value.nombre) return
  if (modalModo.value === 'nuevo') {
    crearProveedor(draft.value)
  } else if (proveedorEditando.value) {
    actualizarProveedor(proveedorEditando.value.id, draft.value)
  }
  modalVisible.value = false
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Proveedores
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ proveedores.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Proveedores registrados por categoría y estado</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo proveedor
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, NIT, correo o categoría..." class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select v-model="filtroCategoria" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Categoría: Todas</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ proveedoresFiltrados.length }}</strong> proveedores
      </div>
    </div>

    <ProveedoresTable :rows="proveedoresFiltrados" @editar="abrirEditar" />

    <ProveedorFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      @submit="guardar"
    />
  </div>
</template>
