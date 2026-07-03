<script setup lang="ts">
import { ref, computed } from 'vue'
import { Heart, Users, Plus, Search, Download, Upload } from 'lucide-vue-next'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft } from '../types/plan-liga'
import { BENEFICIARIO_DRAFT_VACIO, CUPO_MAXIMO, TITULAR_DRAFT_VACIO } from '../constants/plan-liga.constants'
import { usePlanLiga } from '../composables/usePlanLiga'
import TitularesTable from '../tables/TitularesTable.vue'
import TitularFormDialog from '../dialogs/TitularFormDialog.vue'
import BeneficiarioFormDialog from '../dialogs/BeneficiarioFormDialog.vue'
import BeneficiariosDrawer from '../dialogs/BeneficiariosDrawer.vue'
import SeguimientoDialog from '../dialogs/SeguimientoDialog.vue'
import ImportacionPlanLigaDialog from '../dialogs/ImportacionPlanLigaDialog.vue'

const {
  buscar, filtroEstado, filtroPlan, filtroSexo, filtroEdad,
  titularesFiltrados, planes,
  totalActivos, totalBeneficiarios, titularesTope,
  activosPorTitular, puedeAgregar,
  crearTitular, actualizarTitular, toggleEstadoTitular,
  beneficiariosDeTitular, crearBeneficiario, actualizarBeneficiario, cambiarEstadoBeneficiario,
} = usePlanLiga()

// ─── Modal Titular ───────────────────────────────────────────────
const modalTitularVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const titularEditando = ref<Titular | null>(null)
const draftTitular = ref<TitularDraft>({ ...TITULAR_DRAFT_VACIO })

const abrirNuevoTitular = () => {
  modalModo.value = 'nuevo'
  titularEditando.value = null
  draftTitular.value = { ...TITULAR_DRAFT_VACIO, fechaInscripcion: new Date().toISOString().split('T')[0] }
  modalTitularVisible.value = true
}
const abrirEditarTitular = (t: Titular) => {
  modalModo.value = 'editar'
  titularEditando.value = t
  draftTitular.value = { ...t }
  modalTitularVisible.value = true
}
const guardarTitular = () => {
  if (!draftTitular.value.documento || !draftTitular.value.nombre) return
  if (modalModo.value === 'nuevo') {
    crearTitular(draftTitular.value)
  } else if (titularEditando.value) {
    actualizarTitular(titularEditando.value.id, draftTitular.value)
  }
  modalTitularVisible.value = false
}

// ─── Drawer Beneficiarios ────────────────────────────────────────
const drawerVisible = ref(false)
const titularSeleccionado = ref<Titular | null>(null)
const errLimite = ref(false)

const abrirBeneficiarios = (t: Titular) => { titularSeleccionado.value = t; drawerVisible.value = true; errLimite.value = false }
const beneficiariosTitular = computed(() => titularSeleccionado.value ? beneficiariosDeTitular(titularSeleccionado.value.id) : [])
const activosActual = computed(() => titularSeleccionado.value ? activosPorTitular(titularSeleccionado.value.id) : 0)

// ─── Modal Beneficiario ──────────────────────────────────────────
const modalBeneVisible = ref(false)
const modalBeneModo = ref<'nuevo' | 'editar'>('nuevo')
const beneficiarioEditando = ref<Beneficiario | null>(null)
const draftBene = ref<BeneficiarioDraft>({ ...BENEFICIARIO_DRAFT_VACIO })

const abrirNuevoBeneficiario = () => {
  if (!titularSeleccionado.value) return
  if (!puedeAgregar(titularSeleccionado.value.id)) { errLimite.value = true; return }
  errLimite.value = false
  modalBeneModo.value = 'nuevo'
  beneficiarioEditando.value = null
  draftBene.value = { ...BENEFICIARIO_DRAFT_VACIO, fechaInscripcion: new Date().toISOString().split('T')[0] }
  modalBeneVisible.value = true
}
const abrirEditarBeneficiario = (b: Beneficiario) => {
  errLimite.value = false
  modalBeneModo.value = 'editar'
  beneficiarioEditando.value = b
  draftBene.value = { ...b }
  modalBeneVisible.value = true
}
const guardarBeneficiario = () => {
  if (!draftBene.value.documento || !draftBene.value.nombre || !titularSeleccionado.value) return
  if (modalBeneModo.value === 'nuevo') {
    crearBeneficiario(titularSeleccionado.value.id, draftBene.value)
  } else if (beneficiarioEditando.value) {
    actualizarBeneficiario(beneficiarioEditando.value.id, draftBene.value)
  }
  modalBeneVisible.value = false
}
const activarBeneficiario = (b: Beneficiario) => {
  if (!titularSeleccionado.value || !puedeAgregar(titularSeleccionado.value.id)) { errLimite.value = true; return }
  cambiarEstadoBeneficiario(b, 'Activo')
}
const desactivarBeneficiario = (b: Beneficiario) => cambiarEstadoBeneficiario(b, 'Inactivo')
const reemplazarBeneficiario = (b: Beneficiario) => {
  cambiarEstadoBeneficiario(b, 'Reemplazado')
  abrirNuevoBeneficiario()
}

// ─── Seguimiento rápido ──────────────────────────────────────────
const modalSegVisible = ref(false)
const titularSegActual = ref<Titular | null>(null)
const abrirSeguimiento = (t: Titular) => { titularSegActual.value = t; modalSegVisible.value = true }

// ─── Importación masiva ──────────────────────────────────────────
const modalImportVisible = ref(false)
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <Heart :size="20" class="text-[#EC4899]" />
          Plan Liga · Afiliaciones
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">Gestión de titulares y beneficiarios del programa Plan Liga Ama Salvar Vidas</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button @click="modalImportVisible = true"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Upload :size="13" /> Importar Excel
        </button>
        <button class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Download :size="13" /> Exportar
        </button>
        <button @click="abrirNuevoTitular"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
          <Plus :size="14" /> Nuevo titular
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#FCE7F3] flex items-center justify-center mb-3"><Heart :size="17" class="text-[#EC4899]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalActivos }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Titulares activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3"><Users :size="17" class="text-[#2447F9]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalBeneficiarios }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Beneficiarios activos</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#FEF9C3] flex items-center justify-center mb-3"><Users :size="17" class="text-[#C9A227]" /></div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ titularesTope }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Titulares en tope ({{ CUPO_MAXIMO }}/{{ CUPO_MAXIMO }})</div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscar" placeholder="Buscar por nombre, documento, empresa o correo..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#EC4899] focus:bg-white transition-all" />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="filtroEstado" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Estado: Todos</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <select v-model="filtroPlan" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Plan: Todos</option>
            <option v-for="p in planes" :key="p" :value="p">{{ p }}</option>
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
        </div>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">Mostrando <strong class="text-slate-600">{{ titularesFiltrados.length }}</strong> titulares</div>
    </div>

    <TitularesTable
      :rows="titularesFiltrados"
      :activos-por-titular="activosPorTitular"
      @seguimiento="abrirSeguimiento"
      @editar="abrirEditarTitular"
      @toggle-estado="toggleEstadoTitular"
      @beneficiarios="abrirBeneficiarios"
    />

    <TitularFormDialog v-model:visible="modalTitularVisible" v-model:draft="draftTitular" :modo="modalModo" @submit="guardarTitular" />

    <BeneficiariosDrawer
      v-model:visible="drawerVisible"
      v-model:err-limite="errLimite"
      :titular="titularSeleccionado"
      :beneficiarios="beneficiariosTitular"
      :activos-actual="activosActual"
      :puede-agregar="puedeAgregar(titularSeleccionado?.id ?? 0)"
      @editar="abrirEditarBeneficiario"
      @activar="activarBeneficiario"
      @desactivar="desactivarBeneficiario"
      @reemplazar="reemplazarBeneficiario"
      @agregar-nuevo="abrirNuevoBeneficiario"
    />

    <BeneficiarioFormDialog
      v-model:visible="modalBeneVisible"
      v-model:draft="draftBene"
      :modo="modalBeneModo"
      :titular-nombre="titularSeleccionado?.nombre"
      :cupos-restantes="CUPO_MAXIMO - activosActual"
      @submit="guardarBeneficiario"
    />

    <SeguimientoDialog v-model:visible="modalSegVisible" :titular="titularSegActual" />

    <ImportacionPlanLigaDialog v-model:visible="modalImportVisible" />
  </div>
</template>
