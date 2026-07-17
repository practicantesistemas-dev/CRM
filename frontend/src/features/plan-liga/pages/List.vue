<script setup lang="ts">
import { ref, computed } from 'vue'
import { Heart, Users, Plus, Search, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft } from '../types/plan-liga'
import { BENEFICIARIO_DRAFT_VACIO, TITULAR_DRAFT_VACIO, cupoMaximoTitular } from '../constants/plan-liga.constants'
import { usePlanLiga } from '../composables/usePlanLiga'
import TitularesTable from '../tables/TitularesTable.vue'
import TitularFormDialog from '../dialogs/TitularFormDialog.vue'
import BeneficiarioFormDialog from '../dialogs/BeneficiarioFormDialog.vue'
import BeneficiariosDrawer from '../dialogs/BeneficiariosDrawer.vue'
import SeguimientoDialog from '../dialogs/SeguimientoDialog.vue'
import ImportacionPlanLigaDialog from '../dialogs/ImportacionPlanLigaDialog.vue'

const {
  buscar, filtroEstado, filtroPlan, filtroSexo, filtroEdad,
  titulares, planes,
  totalActivos, totalBeneficiarios,
  totalTitulares, paginaActual, totalPaginas, hayPaginaAnterior, hayPaginaSiguiente,
  paginaSiguiente, paginaAnterior,
  activosPorTitular,
  obtenerTitular,
  crearTitular, actualizarTitular, toggleEstadoTitular,
  crearBeneficiario, actualizarBeneficiario, cambiarEstadoBeneficiario,
  guardandoBeneficiario, errorGuardarBeneficiario,
  beneficiariosTitular, cargandoBeneficiariosTitular, cargarBeneficiariosTitular,
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
const cargandoEditarId = ref<number | null>(null)
const abrirEditarTitular = async (t: Titular) => {
  cargandoEditarId.value = t.id
  const detalle = await obtenerTitular(t.id)
  cargandoEditarId.value = null

  modalModo.value = 'editar'
  titularEditando.value = detalle ?? t
  draftTitular.value = { ...t, ...detalle }
  modalTitularVisible.value = true
}
const guardarTitular = () => {
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

const abrirBeneficiarios = (t: Titular) => {
  titularSeleccionado.value = t
  drawerVisible.value = true
  errLimite.value = false
  cargarBeneficiariosTitular(t.id)
}
const activosActual = computed(() => beneficiariosTitular.value.filter(b => b.estado === 'Activo').length)
const cupoMaximoActual = computed(() => titularSeleccionado.value ? cupoMaximoTitular(titularSeleccionado.value) : 0)
const puedeAgregarActual = computed(() => activosActual.value < cupoMaximoActual.value)

// ─── Modal Beneficiario ──────────────────────────────────────────
const modalBeneVisible = ref(false)
const modalBeneModo = ref<'nuevo' | 'editar'>('nuevo')
const beneficiarioEditando = ref<Beneficiario | null>(null)
const draftBene = ref<BeneficiarioDraft>({ ...BENEFICIARIO_DRAFT_VACIO })

const abrirNuevoBeneficiario = () => {
  if (!titularSeleccionado.value) return
  if (!puedeAgregarActual.value) { errLimite.value = true; return }
  errLimite.value = false
  modalBeneModo.value = 'nuevo'
  beneficiarioEditando.value = null
  draftBene.value = { ...BENEFICIARIO_DRAFT_VACIO, fechaInscripcion: new Date().toISOString().split('T')[0] }
  modalBeneVisible.value = true
}
const abrirEditarBeneficiario = (b: Beneficiario) => {
  errLimite.value = false
  errorGuardarBeneficiario.value = null
  modalBeneModo.value = 'editar'
  beneficiarioEditando.value = b
  draftBene.value = { ...b }
  modalBeneVisible.value = true
}
const guardarBeneficiario = async () => {
  if (!titularSeleccionado.value) return
  if (modalBeneModo.value === 'nuevo') {
    crearBeneficiario(titularSeleccionado.value.id, draftBene.value)
    modalBeneVisible.value = false
  } else if (beneficiarioEditando.value) {
    const ok = await actualizarBeneficiario(titularSeleccionado.value.id, beneficiarioEditando.value.id, draftBene.value)
    if (ok) modalBeneVisible.value = false
  }
}
const activarBeneficiario = (b: Beneficiario) => {
  if (!puedeAgregarActual.value) { errLimite.value = true; return }
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

    <div class="grid grid-cols-2 gap-4">
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
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ titulares.length }}</strong> de <strong class="text-slate-600">{{ totalTitulares }}</strong> titulares
      </div>
    </div>

    <TitularesTable
      :rows="titulares"
      :activos-por-titular="activosPorTitular"
      :cargando-editar-id="cargandoEditarId"
      @seguimiento="abrirSeguimiento"
      @editar="abrirEditarTitular"
      @toggle-estado="toggleEstadoTitular"
      @beneficiarios="abrirBeneficiarios"
    />

    <div v-if="totalTitulares > 0" class="flex items-center justify-center gap-3 px-1">
      <button @click="paginaAnterior" :disabled="!hayPaginaAnterior"
        class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página anterior">
        <ChevronLeft :size="15" />
      </button>
      <span class="text-[11px] text-slate-400">Página <strong class="text-slate-600">{{ paginaActual }}</strong> de <strong class="text-slate-600">{{ totalPaginas }}</strong></span>
      <button @click="paginaSiguiente" :disabled="!hayPaginaSiguiente"
        class="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        title="Página siguiente">
        <ChevronRight :size="15" />
      </button>
    </div>

    <TitularFormDialog v-model:visible="modalTitularVisible" v-model:draft="draftTitular" :modo="modalModo" @submit="guardarTitular" />

    <BeneficiariosDrawer
      v-model:visible="drawerVisible"
      v-model:err-limite="errLimite"
      :titular="titularSeleccionado"
      :beneficiarios="beneficiariosTitular"
      :cargando="cargandoBeneficiariosTitular"
      :activos-actual="activosActual"
      :cupo-maximo="cupoMaximoActual"
      :puede-agregar="puedeAgregarActual"
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
      :cupos-restantes="cupoMaximoActual - activosActual"
      :guardando="guardandoBeneficiario"
      :error="errorGuardarBeneficiario"
      @submit="guardarBeneficiario"
    />

    <SeguimientoDialog v-model:visible="modalSegVisible" :titular="titularSegActual" />

    <ImportacionPlanLigaDialog v-model:visible="modalImportVisible" />
  </div>
</template>
