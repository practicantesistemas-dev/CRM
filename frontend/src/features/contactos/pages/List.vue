<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus, Download, Upload, X } from 'lucide-vue-next'
import type { Contacto, ContactoDraft } from '../types/contacto'
import { CONTACTO_DRAFT_VACIO, HISTORIAL_MOCK } from '../constants/contactos.constants'
import { useContactos } from '../composables/useContactos'
import ContactoFormDialog from '../dialogs/ContactoFormDialog.vue'
import SeguimientoDialog from '../dialogs/SeguimientoDialog.vue'
import HistorialDrawer from '../dialogs/HistorialDrawer.vue'
import ContactosTable from '../tables/ContactosTable.vue'

const {
  contactos, buscar, filtroEstado, filtroCiudad, filtroResponsable, filtroSexo, filtroEdad,
  contactosFiltrados, ciudades, responsables, filtrosActivos, limpiarFiltros,
  paginaActual, paginado, totalPaginas,
  crearContacto, actualizarContacto,
} = useContactos()

// ─── Modal Contacto ─────────────────────────────────────────────────────────
const modalVisible     = ref(false)
const modalModo        = ref<'nuevo' | 'editar'>('nuevo')
const contactoEditando = ref<Contacto | null>(null)
const draft            = ref<ContactoDraft>({ ...CONTACTO_DRAFT_VACIO })

const abrirNuevo = () => {
  modalModo.value = 'nuevo'
  contactoEditando.value = null
  draft.value = { ...CONTACTO_DRAFT_VACIO, etiquetas: [] }
  modalVisible.value = true
}
const abrirEditar = (c: Contacto) => {
  modalModo.value = 'editar'
  contactoEditando.value = c
  draft.value = { ...c, etiquetas: [...c.etiquetas] }
  modalVisible.value = true
}
const guardarContacto = () => {
  if (modalModo.value === 'nuevo') {
    crearContacto(draft.value)
  } else if (contactoEditando.value) {
    actualizarContacto(contactoEditando.value.id, draft.value)
  }
  modalVisible.value = false
}

// ─── Historial drawer ───────────────────────────────────────────────────────
const drawerVisible     = ref(false)
const contactoHistorial = ref<Contacto | null>(null)
const abrirHistorial = (c: Contacto) => { contactoHistorial.value = c; drawerVisible.value = true }

// ─── Seguimiento rápido ─────────────────────────────────────────────────────
const modalSegVisible   = ref(false)
const contactoSegActual = ref<Contacto | null>(null)
const abrirSeguimiento = (c: Contacto) => { contactoSegActual.value = c; modalSegVisible.value = true }
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <!-- ── Page Header ──────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          Gestión de Contactos
          <span class="bg-[#EEF2FF] text-[#2447F9] text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ contactos.length }}</span>
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Administra contactos, cargos, etiquetas y seguimientos</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Upload :size="13" /> Importar
        </button>
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevo" class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">
          <Plus :size="14" /> Nuevo contacto
        </button>
      </div>
    </div>

    <!-- ── Toolbar ───────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, correo, empresa o documento..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Prospecto">Prospecto</option>
            <option value="En proceso">En proceso</option>
          </select>
          <select v-model="filtroCiudad" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todas">Ciudad: Todas</option>
            <option v-for="ciudad in ciudades" :key="ciudad" :value="ciudad">{{ ciudad }}</option>
          </select>
          <select v-model="filtroResponsable" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Responsable: Todos</option>
            <option v-for="r in responsables" :key="r" :value="r">{{ r }}</option>
          </select>
          <select v-model="filtroSexo" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Sexo: Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
          <select v-model="filtroEdad" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Edad: Todos</option>
            <option value="0-17">0 – 17 años</option>
            <option value="18-35">18 – 35 años</option>
            <option value="36-50">36 – 50 años</option>
            <option value="51+">51+ años</option>
          </select>
          <button v-if="filtrosActivos > 0" @click="limpiarFiltros"
            class="flex items-center gap-1 h-9 px-3 rounded-lg border border-red-200 bg-red-50 text-[11px] font-semibold text-red-500 hover:bg-red-100 transition-all">
            <X :size="12" /> Limpiar ({{ filtrosActivos }})
          </button>
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ contactosFiltrados.length }}</strong> contactos
        <span v-if="buscar || filtrosActivos > 0"> · filtrado de {{ contactos.length }} total</span>
      </div>
    </div>

    <!-- ── Table ─────────────────────────────────────────────────── -->
    <ContactosTable
      :rows="paginado"
      :pagina-actual="paginaActual"
      :total-paginas="totalPaginas"
      @editar="abrirEditar"
      @historial="abrirHistorial"
      @seguimiento="abrirSeguimiento"
      @update:pagina-actual="paginaActual = $event"
    />

    <ContactoFormDialog
      v-model:visible="modalVisible"
      v-model:draft="draft"
      :modo="modalModo"
      @submit="guardarContacto"
    />

    <SeguimientoDialog
      v-model:visible="modalSegVisible"
      :contacto="contactoSegActual"
    />

    <HistorialDrawer
      v-model:visible="drawerVisible"
      :contacto="contactoHistorial"
      :items="HISTORIAL_MOCK"
      @registrar="contactoHistorial && abrirSeguimiento(contactoHistorial)"
    />
  </div>
</template>
