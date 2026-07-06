<script setup lang="ts">
import { ref } from 'vue'
import { Zap, Plus, Search, CheckCircle, XCircle } from 'lucide-vue-next'
import type { Automatizacion, AutomatizacionDraft } from '../types/automatizacion'
import { AUTOMATIZACION_DRAFT_VACIO } from '../constants/automatizaciones.constants'
import { useAutomatizaciones } from '../composables/useAutomatizaciones'
import AutomatizacionCard from '../components/AutomatizacionCard.vue'
import AutomatizacionFormDialog from '../dialogs/AutomatizacionFormDialog.vue'
import ConfirmarEliminarDialog from '../dialogs/ConfirmarEliminarDialog.vue'

const {
  buscar, filtroEstado,
  filtradas, totalActivas, totalEjecuciones, totalError,
  toggleActivo, eliminar, crearAutomatizacion, actualizarAutomatizacion,
} = useAutomatizaciones()

const modalVisible = ref(false)
const modalModo = ref<'nuevo' | 'editar'>('nuevo')
const editando = ref<Automatizacion | null>(null)
const draft = ref<AutomatizacionDraft>({ ...AUTOMATIZACION_DRAFT_VACIO })

const abrirNueva = () => {
  modalModo.value = 'nuevo'
  editando.value = null
  draft.value = { ...AUTOMATIZACION_DRAFT_VACIO }
  modalVisible.value = true
}
const abrirEditar = (a: Automatizacion) => {
  modalModo.value = 'editar'
  editando.value = a
  draft.value = { nombre: a.nombre, descripcion: a.descripcion, trigger: a.trigger, accion: a.accion }
  modalVisible.value = true
}
const guardar = () => {
  if (modalModo.value === 'nuevo') {
    crearAutomatizacion(draft.value)
  } else if (editando.value) {
    actualizarAutomatizacion(editando.value.id, draft.value)
  }
  modalVisible.value = false
}

const confirmarEliminar = ref<Automatizacion | null>(null)
const eliminarConfirmado = () => {
  if (!confirmarEliminar.value) return
  eliminar(confirmarEliminar.value.id)
  confirmarEliminar.value = null
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-[18px] font-bold text-[#0F172A] flex items-center gap-2">
          <Zap :size="20" class="text-[#C9A227]" />
          Automatizaciones
        </h2>
        <p class="text-[12px] text-slate-500 mt-0.5">
          Reglas de automatización de procesos comerciales y de marketing
        </p>
      </div>
      <button
        @click="abrirNueva"
        class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all"
      >
        <Plus :size="14" /> Nueva automatización
      </button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#D1FAE5] flex items-center justify-center mb-3">
          <CheckCircle :size="17" class="text-[#059669]" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalActivas }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Activas</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3">
          <Zap :size="17" class="text-[#2447F9]" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalEjecuciones.toLocaleString('es-CO') }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Ejecuciones totales</div>
      </div>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <XCircle :size="17" class="text-red-500" />
        </div>
        <div class="text-[28px] font-bold text-[#0F172A] leading-none">{{ totalError }}</div>
        <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-1">Con errores</div>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-3">
      <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div class="relative flex-1 min-w-0">
          <Search :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="buscar"
            placeholder="Buscar por nombre, trigger o acción..."
            class="w-full h-9 pl-9 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all"
          />
        </div>
        <select
          v-model="filtroEstado"
          class="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
        >
          <option value="todos">Estado: Todos</option>
          <option value="Activa">Activa</option>
          <option value="Pausada">Pausada</option>
          <option value="Error">Error</option>
        </select>
      </div>
      <div class="mt-2 text-[11px] text-slate-400">
        Mostrando <strong class="text-slate-600">{{ filtradas.length }}</strong> automatizaciones
      </div>
    </div>

    <div class="space-y-3">
      <AutomatizacionCard
        v-for="auto in filtradas"
        :key="auto.id"
        :automatizacion="auto"
        @toggle-activo="toggleActivo(auto)"
        @editar="abrirEditar(auto)"
        @eliminar="confirmarEliminar = auto"
      />

      <div v-if="filtradas.length === 0" class="bg-white rounded-2xl border border-slate-200 shadow-sm text-center py-16">
        <Zap :size="32" class="text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-semibold text-slate-500">No hay automatizaciones</p>
        <p class="text-[11px] text-slate-400 mt-1">Crea una nueva para automatizar tus procesos.</p>
        <button
          @click="abrirNueva"
          class="mt-4 flex items-center gap-1.5 h-9 px-5 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all mx-auto"
        >
          <Plus :size="13" /> Crear automatización
        </button>
      </div>
    </div>

    <AutomatizacionFormDialog v-model:visible="modalVisible" v-model:draft="draft" :modo="modalModo" @submit="guardar" />

    <ConfirmarEliminarDialog
      :automatizacion="confirmarEliminar"
      @confirmar="eliminarConfirmado"
      @cancelar="confirmarEliminar = null"
    />
  </div>
</template>
