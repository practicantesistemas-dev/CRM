<script setup lang="ts">
import { ref, computed } from 'vue'
import { Heart, Users, Plus, Search, Download, Upload, ChevronLeft, ChevronRight, Loader2, CheckCircle2, X } from 'lucide-vue-next'
import type { Beneficiario, BeneficiarioDraft, Titular, TitularDraft, ReemplazoPersonaDraft } from '../types/plan-liga'
import { BENEFICIARIO_DRAFT_VACIO, TITULAR_DRAFT_VACIO, REEMPLAZO_PERSONA_DRAFT_VACIO, cupoMaximoTitular } from '../constants/plan-liga.constants'
import { usePlanLiga } from '../composables/usePlanLiga'
import TitularesTable from '../tables/TitularesTable.vue'
import TitularFormDialog from '../dialogs/TitularFormDialog.vue'
import BeneficiarioFormDialog from '../dialogs/BeneficiarioFormDialog.vue'
import BeneficiariosDrawer from '../dialogs/BeneficiariosDrawer.vue'
import ActivarFechaDialog from '../dialogs/ActivarFechaDialog.vue'
import ConfirmarDesactivarDialog from '../dialogs/ConfirmarDesactivarDialog.vue'
import ReemplazarPersonaDialog from '../dialogs/ReemplazarPersonaDialog.vue'
import SeguimientoDialog from '../dialogs/SeguimientoDialog.vue'
import ImportacionPlanLigaDialog from '../dialogs/ImportacionPlanLigaDialog.vue'

const {
  buscar, filtroEstado, filtroPlan, filtroSexo, filtroEdad,
  titulares, planesServicio,
  totalActivos, totalBeneficiarios,
  totalTitulares, paginaActual, totalPaginas, hayPaginaAnterior, hayPaginaSiguiente,
  paginaSiguiente, paginaAnterior,
  exportarListado, exportando, errorExportar,
  activosPorTitular,
  obtenerTitular,
  crearTitular, actualizarTitular, toggleEstadoTitular,
  guardandoTitular, errorGuardarTitular,
  reemplazarTitularAccion, reemplazandoTitular, errorReemplazarTitular, resultadoReemplazoTitular,
  crearBeneficiario, actualizarBeneficiario,
  guardandoBeneficiario, errorGuardarBeneficiario,
  activarEstadoBeneficiario, desactivarEstadoBeneficiario, errorEstadoBeneficiario, guardandoEstadoBeneficiario,
  reemplazarBeneficiarioAccion, reemplazandoBeneficiario, errorReemplazarBeneficiario, resultadoReemplazoBeneficiario,
  beneficiariosTitular, cargandoBeneficiariosTitular, cargarBeneficiariosTitular,
} = usePlanLiga()

// ─── Aviso de éxito tras un reemplazo (no hay sistema de toasts en la app) ────────
const avisoReemplazo = ref<string | null>(null)
const mensajeServinteIncle = (usuarioServinteCreado: boolean, marcadoEnIncle: boolean, registrosIncleMarcadosAnterior: number) =>
  `Usuario Servinte: ${usuarioServinteCreado ? 'creado' : 'no creado'}. `
  + `INCLE: ${marcadoEnIncle ? `marcado (${registrosIncleMarcadosAnterior} registro(s) del anterior)` : 'no marcado'}.`

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

  errorGuardarTitular.value = null
  modalModo.value = 'editar'
  titularEditando.value = detalle ?? t
  draftTitular.value = { ...t, ...detalle }
  modalTitularVisible.value = true
}
const guardarTitular = async () => {
  if (modalModo.value === 'nuevo') {
    const ok = await crearTitular(draftTitular.value)
    if (ok) modalTitularVisible.value = false
  } else if (titularEditando.value) {
    const ok = await actualizarTitular(titularEditando.value.id, draftTitular.value)
    if (ok) modalTitularVisible.value = false
  }
}

const modalActivarTitularVisible = ref(false)
const titularActivando = ref<Titular | null>(null)
const modalDesactivarTitularVisible = ref(false)
const titularDesactivando = ref<Titular | null>(null)

const toggleEstadoTitularConFecha = (t: Titular) => {
  errorGuardarTitular.value = null
  if (t.estado === 'Activo') {
    titularDesactivando.value = t
    modalDesactivarTitularVisible.value = true
    return
  }
  titularActivando.value = t
  modalActivarTitularVisible.value = true
}
const confirmarActivarTitular = async (fechaIngreso: string) => {
  if (!titularActivando.value) return
  await toggleEstadoTitular(titularActivando.value, fechaIngreso)
  if (!errorGuardarTitular.value) modalActivarTitularVisible.value = false
}
const confirmarDesactivarTitular = async () => {
  if (!titularDesactivando.value) return
  await toggleEstadoTitular(titularDesactivando.value)
  if (!errorGuardarTitular.value) modalDesactivarTitularVisible.value = false
}

const modalReemplazarTitularVisible = ref(false)
const titularReemplazando = ref<Titular | null>(null)
const draftReemplazoTitular = ref<ReemplazoPersonaDraft>({ ...REEMPLAZO_PERSONA_DRAFT_VACIO })

const abrirReemplazarTitular = (t: Titular) => {
  errorReemplazarTitular.value = null
  titularReemplazando.value = t
  draftReemplazoTitular.value = { ...REEMPLAZO_PERSONA_DRAFT_VACIO }
  modalReemplazarTitularVisible.value = true
}
const confirmarReemplazarTitular = async () => {
  if (!titularReemplazando.value) return
  const ok = await reemplazarTitularAccion(titularReemplazando.value, draftReemplazoTitular.value)
  const r = resultadoReemplazoTitular.value
  if (ok && r) {
    modalReemplazarTitularVisible.value = false
    avisoReemplazo.value = `Titular reemplazado correctamente. Beneficiarios reasignados: ${r.beneficiariosReasignados}. `
      + mensajeServinteIncle(r.usuarioServinteCreado, r.marcadoEnIncle, r.registrosIncleMarcadosAnterior)
  }
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
    const ok = await crearBeneficiario(titularSeleccionado.value.id, draftBene.value)
    if (ok) modalBeneVisible.value = false
  } else if (beneficiarioEditando.value) {
    const ok = await actualizarBeneficiario(titularSeleccionado.value.id, beneficiarioEditando.value.id, draftBene.value)
    if (ok) modalBeneVisible.value = false
  }
}
const modalActivarVisible = ref(false)
const beneficiarioActivando = ref<Beneficiario | null>(null)

const activarBeneficiario = (b: Beneficiario) => {
  if (!titularSeleccionado.value) return
  if (!puedeAgregarActual.value) { errLimite.value = true; return }
  errorEstadoBeneficiario.value = null
  beneficiarioActivando.value = b
  modalActivarVisible.value = true
}
const confirmarActivarBeneficiario = async (fechaIngreso: string) => {
  if (!titularSeleccionado.value || !beneficiarioActivando.value) return
  await activarEstadoBeneficiario(titularSeleccionado.value.id, beneficiarioActivando.value, fechaIngreso)
  if (!errorEstadoBeneficiario.value) modalActivarVisible.value = false
}
const modalDesactivarBeneVisible = ref(false)
const beneficiarioDesactivando = ref<Beneficiario | null>(null)

const desactivarBeneficiario = (b: Beneficiario) => {
  if (!titularSeleccionado.value) return
  errorEstadoBeneficiario.value = null
  beneficiarioDesactivando.value = b
  modalDesactivarBeneVisible.value = true
}
const confirmarDesactivarBeneficiario = async () => {
  if (!titularSeleccionado.value || !beneficiarioDesactivando.value) return
  await desactivarEstadoBeneficiario(titularSeleccionado.value.id, beneficiarioDesactivando.value)
  if (!errorEstadoBeneficiario.value) modalDesactivarBeneVisible.value = false
}
const modalReemplazarBeneVisible = ref(false)
const beneficiarioReemplazando = ref<Beneficiario | null>(null)
const draftReemplazoBene = ref<ReemplazoPersonaDraft>({ ...REEMPLAZO_PERSONA_DRAFT_VACIO })

const abrirReemplazarBeneficiario = (b: Beneficiario) => {
  errorReemplazarBeneficiario.value = null
  beneficiarioReemplazando.value = b
  draftReemplazoBene.value = { ...REEMPLAZO_PERSONA_DRAFT_VACIO }
  modalReemplazarBeneVisible.value = true
}
const confirmarReemplazarBeneficiario = async () => {
  if (!titularSeleccionado.value || !beneficiarioReemplazando.value) return
  const ok = await reemplazarBeneficiarioAccion(titularSeleccionado.value.id, beneficiarioReemplazando.value, draftReemplazoBene.value)
  const r = resultadoReemplazoBeneficiario.value
  if (ok && r) {
    modalReemplazarBeneVisible.value = false
    avisoReemplazo.value = `Beneficiario reemplazado correctamente. ${mensajeServinteIncle(r.usuarioServinteCreado, r.marcadoEnIncle, r.registrosIncleMarcadosAnterior)}`
  }
}

// ─── Seguimiento rápido ──────────────────────────────────────────
const modalSegVisible = ref(false)
const titularSegActual = ref<Titular | null>(null)
const beneficiarioSegActual = ref<Beneficiario | null>(null)
const abrirSeguimiento = (t: Titular) => { titularSegActual.value = t; beneficiarioSegActual.value = null; modalSegVisible.value = true }
const abrirSeguimientoBeneficiario = (b: Beneficiario) => {
  if (!titularSeleccionado.value) return
  titularSegActual.value = titularSeleccionado.value
  beneficiarioSegActual.value = b
  modalSegVisible.value = true
}

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
        <p v-if="errorExportar" class="text-[11px] text-red-600 mt-1">{{ errorExportar }}</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button @click="modalImportVisible = true"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all">
          <Upload :size="13" /> Importar Excel
        </button>
        <button @click="exportarListado" :disabled="exportando"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
          <Loader2 v-if="exportando" :size="13" class="animate-spin" />
          <Download v-else :size="13" />
          {{ exportando ? 'Exportando...' : 'Exportar' }}
        </button>
        <button @click="abrirNuevoTitular"
          class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#EC4899] text-white text-[11px] font-bold shadow hover:bg-[#D61F69] transition-all">
          <Plus :size="14" /> Nuevo titular
        </button>
      </div>
    </div>

    <div v-if="exportando" class="flex items-center gap-2.5 bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl px-4 py-3">
      <Loader2 :size="16" class="animate-spin text-[#2447F9] shrink-0" />
      <p class="text-[12px] font-semibold text-[#2447F9]">Generando el archivo, esto puede tardar unos segundos...</p>
    </div>

    <div v-if="avisoReemplazo" class="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
      <CheckCircle2 :size="16" class="text-emerald-600 shrink-0" />
      <p class="text-[12px] font-semibold text-emerald-700">{{ avisoReemplazo }}</p>
      <button @click="avisoReemplazo = null" class="ml-auto text-emerald-400 hover:text-emerald-600 shrink-0"><X :size="13" /></button>
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
            <option value="estandar">Estándar</option>
            <option v-for="p in planesServicio" :key="p.id" :value="p.id">{{ p.nombre }}</option>
          </select>
          <select v-model="filtroSexo" class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer">
            <option value="todos">Sexo biológico: Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
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
      @toggle-estado="toggleEstadoTitularConFecha"
      @beneficiarios="abrirBeneficiarios"
      @reemplazar="abrirReemplazarTitular"
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

    <TitularFormDialog v-model:visible="modalTitularVisible" v-model:draft="draftTitular" :modo="modalModo"
      :guardando="guardandoTitular" :error="errorGuardarTitular" :planes-servicio="planesServicio" @submit="guardarTitular" />

    <BeneficiariosDrawer
      v-model:visible="drawerVisible"
      v-model:err-limite="errLimite"
      :titular="titularSeleccionado"
      :beneficiarios="beneficiariosTitular"
      :cargando="cargandoBeneficiariosTitular"
      :activos-actual="activosActual"
      :cupo-maximo="cupoMaximoActual"
      :puede-agregar="puedeAgregarActual"
      :error="errorEstadoBeneficiario"
      @editar="abrirEditarBeneficiario"
      @activar="activarBeneficiario"
      @desactivar="desactivarBeneficiario"
      @reemplazar="abrirReemplazarBeneficiario"
      @seguimiento="abrirSeguimientoBeneficiario"
      @agregar-nuevo="abrirNuevoBeneficiario"
    />

    <ActivarFechaDialog
      v-model:visible="modalActivarVisible"
      titulo="Activar beneficiario"
      :nombre="beneficiarioActivando?.nombre"
      :guardando="guardandoEstadoBeneficiario"
      :error="errorEstadoBeneficiario"
      @confirmar="confirmarActivarBeneficiario"
      @cancelar="errorEstadoBeneficiario = null"
    />

    <ConfirmarDesactivarDialog
      v-model:visible="modalDesactivarBeneVisible"
      titulo="Desactivar beneficiario"
      :nombre="beneficiarioDesactivando?.nombre"
      :guardando="guardandoEstadoBeneficiario"
      :error="errorEstadoBeneficiario"
      @confirmar="confirmarDesactivarBeneficiario"
      @cancelar="errorEstadoBeneficiario = null"
    />

    <ActivarFechaDialog
      v-model:visible="modalActivarTitularVisible"
      titulo="Activar titular"
      :nombre="titularActivando?.nombre"
      :guardando="guardandoTitular"
      :error="errorGuardarTitular"
      pedir-fecha
      @confirmar="confirmarActivarTitular"
      @cancelar="errorGuardarTitular = null"
    />

    <ConfirmarDesactivarDialog
      v-model:visible="modalDesactivarTitularVisible"
      titulo="Desactivar titular"
      :nombre="titularDesactivando?.nombre"
      :guardando="guardandoTitular"
      :error="errorGuardarTitular"
      @confirmar="confirmarDesactivarTitular"
      @cancelar="errorGuardarTitular = null"
    />

    <ReemplazarPersonaDialog
      v-model:visible="modalReemplazarTitularVisible"
      v-model:draft="draftReemplazoTitular"
      tipo="titular"
      :nombre-actual="titularReemplazando?.nombre"
      :documento-actual="titularReemplazando?.documento"
      :guardando="reemplazandoTitular"
      :error="errorReemplazarTitular"
      @submit="confirmarReemplazarTitular"
    />

    <ReemplazarPersonaDialog
      v-model:visible="modalReemplazarBeneVisible"
      v-model:draft="draftReemplazoBene"
      tipo="beneficiario"
      :nombre-actual="beneficiarioReemplazando?.nombre"
      :documento-actual="beneficiarioReemplazando?.documento"
      :titular-nombre="titularSeleccionado?.nombre"
      :guardando="reemplazandoBeneficiario"
      :error="errorReemplazarBeneficiario"
      @submit="confirmarReemplazarBeneficiario"
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

    <SeguimientoDialog v-model:visible="modalSegVisible" :titular="titularSegActual" :beneficiario="beneficiarioSegActual" />

    <ImportacionPlanLigaDialog v-model:visible="modalImportVisible" />
  </div>
</template>
